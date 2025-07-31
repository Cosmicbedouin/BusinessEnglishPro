from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List
import logging
from pathlib import Path
from dotenv import load_dotenv
import os

# Import our modules
from database import connect_to_mongo, close_mongo_connection, get_database
from models import (
    User, UserCreate, UserLogin, UserResponse, Token, 
    DifficultyLevel, Lesson, Quiz, Achievement, 
    ProgressUpdate, QuizSubmission, UserStats
)
from auth import (
    authenticate_user, create_access_token, get_current_user, 
    get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Business English Learning API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    db = await get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        firstName=user_data.firstName,
        password=hashed_password
    )
    
    # Insert user into database
    user_dict = user.dict()
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            firstName=user.firstName,
            level=user.level,
            points=user.points,
            streak=user.streak,
            completedLessons=user.completedLessons,
            achievements=user.achievements
        )
    }

@api_router.post("/auth/login", response_model=dict)
async def login(user_credentials: UserLogin):
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            firstName=user.firstName,
            level=user.level,
            points=user.points,
            streak=user.streak,
            completedLessons=user.completedLessons,
            achievements=user.achievements
        )
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        firstName=current_user.firstName,
        level=current_user.level,
        points=current_user.points,
        streak=current_user.streak,
        completedLessons=current_user.completedLessons,
        achievements=current_user.achievements
    )

# Content endpoints
@api_router.get("/levels", response_model=List[DifficultyLevel])
async def get_difficulty_levels():
    db = await get_database()
    levels = await db.difficulty_levels.find().to_list(100)
    
    # Remove MongoDB _id field
    for level in levels:
        if "_id" in level:
            del level["_id"]
    
    return [DifficultyLevel(**level) for level in levels]

@api_router.get("/levels/{level_id}/lessons", response_model=List[Lesson])
async def get_lessons_by_level(level_id: str):
    db = await get_database()
    lessons = await db.lessons.find({"levelId": level_id}).sort("order", 1).to_list(100)
    
    # Remove MongoDB _id field
    for lesson in lessons:
        if "_id" in lesson:
            del lesson["_id"]
    
    return [Lesson(**lesson) for lesson in lessons]

@api_router.get("/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str):
    db = await get_database()
    lesson = await db.lessons.find_one({"id": lesson_id})
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    if "_id" in lesson:
        del lesson["_id"]
    
    return Lesson(**lesson)

@api_router.get("/lessons/{lesson_id}/quiz", response_model=Quiz)
async def get_lesson_quiz(lesson_id: str):
    db = await get_database()
    quiz = await db.quizzes.find_one({"lessonId": lesson_id})
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if "_id" in quiz:
        del quiz["_id"]
    
    return Quiz(**quiz)

# Progress and gamification endpoints
@api_router.post("/progress/lesson/{lesson_id}")
async def update_lesson_progress(
    lesson_id: str, 
    progress_data: ProgressUpdate,
    current_user: User = Depends(get_current_user)
):
    db = await get_database()
    
    # Update user progress
    update_data = {
        "$addToSet": {"completedLessons": lesson_id},
        "$inc": {"points": progress_data.points},
        "$set": {"updatedAt": datetime.utcnow()}
    }
    
    # Add new achievements
    if progress_data.achievements:
        update_data["$addToSet"]["achievements"] = {"$each": progress_data.achievements}
    
    await db.users.update_one(
        {"email": current_user.email},
        update_data
    )
    
    return {"message": "Progress updated successfully"}

@api_router.post("/progress/quiz/{lesson_id}")
async def submit_quiz_results(
    lesson_id: str,
    quiz_data: QuizSubmission,
    current_user: User = Depends(get_current_user)
):
    db = await get_database()
    
    # Calculate bonus points based on score
    percentage = (quiz_data.score / quiz_data.totalQuestions) * 100
    
    bonus_points = 0
    new_achievements = []
    
    if percentage >= 90:
        bonus_points = 150
    elif percentage >= 70:
        bonus_points = 100
    elif percentage >= 50:
        bonus_points = 50
    
    # Check for perfect score achievement
    if percentage == 100 and "perfect_score" not in current_user.achievements:
        new_achievements.append("perfect_score")
    
    # Update user progress
    update_data = {
        "$addToSet": {"completedLessons": f"quiz-{lesson_id}"},
        "$inc": {"points": bonus_points},
        "$set": {"updatedAt": datetime.utcnow()}
    }
    
    if new_achievements:
        update_data["$addToSet"]["achievements"] = {"$each": new_achievements}
    
    await db.users.update_one(
        {"email": current_user.email},
        update_data
    )
    
    return {
        "message": "Quiz results submitted successfully",
        "bonusPoints": bonus_points,
        "achievements": new_achievements
    }

@api_router.get("/achievements", response_model=List[Achievement])
async def get_achievements():
    db = await get_database()
    achievements = await db.achievements.find().to_list(100)
    
    # Remove MongoDB _id field
    for achievement in achievements:
        if "_id" in achievement:
            del achievement["_id"]
    
    return [Achievement(**achievement) for achievement in achievements]

@api_router.get("/stats", response_model=UserStats)
async def get_user_stats(current_user: User = Depends(get_current_user)):
    db = await get_database()
    
    # Get level progress
    levels = await db.difficulty_levels.find().to_list(100)
    level_progress = {}
    
    for level in levels:
        level_id = level["id"]
        level_lessons = await db.lessons.find({"levelId": level_id}).to_list(100)
        completed = len([l for l in level_lessons if l["id"] in current_user.completedLessons])
        total = len(level_lessons)
        
        level_progress[level_id] = {
            "completed": completed,
            "total": total,
            "percentage": (completed / total * 100) if total > 0 else 0
        }
    
    return UserStats(
        totalPoints=current_user.points,
        streak=current_user.streak,
        completedLessons=len(current_user.completedLessons),
        achievements=len(current_user.achievements),
        levelProgress=level_progress
    )

# Include the router in the main app
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Business English Learning API is running!"}

# Startup and shutdown events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    logging.info("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()
    logging.info("Disconnected from MongoDB")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)