from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ['MONGO_URL']
    db.client = AsyncIOMotorClient(mongo_url)
    db.database = db.client[os.environ['DB_NAME']]
    
    # Create indexes
    await create_indexes()
    
    # Seed initial data
    await seed_initial_data()

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

async def create_indexes():
    """Create database indexes for better performance"""
    if db.database is not None:
        # User indexes
        await db.database.users.create_index("email", unique=True)
        
        # Lesson indexes
        await db.database.lessons.create_index("id", unique=True)
        await db.database.lessons.create_index([("levelId", 1), ("order", 1)])
        
        # Quiz indexes
        await db.database.quizzes.create_index("lessonId", unique=True)
        
        # Achievement indexes
        await db.database.achievements.create_index("id", unique=True)

async def seed_initial_data():
    """Seed database with initial content"""
    if db.database is None:
        return
    
    # Check if data already exists
    existing_lessons = await db.database.lessons.count_documents({})
    if existing_lessons > 0:
        return
    
    # Seed difficulty levels
    difficulty_levels = [
        {
            "id": "beginner",
            "name": "Beginner",
            "description": "Essential business phrases and basic collocations",
            "color": "from-emerald-500 to-teal-600",
            "icon": "🌱",
            "totalLessons": 2,
            "estimatedTime": "2-3 weeks"
        },
        {
            "id": "intermediate",
            "name": "Intermediate",
            "description": "Complex phrasal verbs and professional idioms",
            "color": "from-blue-500 to-indigo-600",
            "icon": "📈",
            "totalLessons": 1,
            "estimatedTime": "3-4 weeks"
        },
        {
            "id": "advanced",
            "name": "Advanced",
            "description": "Executive-level expressions and nuanced communication",
            "color": "from-purple-500 to-pink-600",
            "icon": "🏆",
            "totalLessons": 1,
            "estimatedTime": "4-5 weeks"
        }
    ]
    
    await db.database.difficulty_levels.insert_many(difficulty_levels)
    
    # Seed lessons
    lessons = [
        # Beginner lessons
        {
            "id": "beginner-1",
            "levelId": "beginner",
            "title": "Meeting Essentials",
            "description": "Key phrases for professional meetings",
            "type": "phrases",
            "points": 100,
            "order": 1,
            "content": {
                "vocabulary": [
                    {
                        "term": "Let's get started",
                        "definition": "Begin a meeting or discussion",
                        "example": "Let's get started with today's agenda."
                    },
                    {
                        "term": "Moving forward",
                        "definition": "Continuing with plans or progress",
                        "example": "Moving forward, we need to focus on quality."
                    },
                    {
                        "term": "Circle back",
                        "definition": "Return to discuss something later",
                        "example": "Let's circle back on this topic next week."
                    },
                    {
                        "term": "Touch base",
                        "definition": "Make contact or check in briefly",
                        "example": "I'll touch base with you on Friday."
                    }
                ]
            }
        },
        {
            "id": "beginner-2",
            "levelId": "beginner",
            "title": "Email Fundamentals",
            "description": "Professional email collocations and phrases",
            "type": "collocations",
            "points": 100,
            "order": 2,
            "content": {
                "vocabulary": [
                    {
                        "term": "Please find attached",
                        "definition": "Formal way to mention attachments",
                        "example": "Please find attached the quarterly report."
                    },
                    {
                        "term": "As discussed",
                        "definition": "Referring to previous conversation",
                        "example": "As discussed in our meeting yesterday..."
                    },
                    {
                        "term": "Follow up on",
                        "definition": "Continue or check progress on something",
                        "example": "I wanted to follow up on our proposal."
                    },
                    {
                        "term": "Keep me posted",
                        "definition": "Inform me of updates",
                        "example": "Please keep me posted on the project status."
                    }
                ]
            }
        },
        # Intermediate lesson
        {
            "id": "intermediate-1",
            "levelId": "intermediate",
            "title": "Negotiation Phrasal Verbs",
            "description": "Essential phrasal verbs for business negotiations",
            "type": "phrasal_verbs",
            "points": 150,
            "order": 1,
            "content": {
                "vocabulary": [
                    {
                        "term": "Bring up",
                        "definition": "Introduce a topic for discussion",
                        "example": "I'd like to bring up the budget concerns."
                    },
                    {
                        "term": "Back down",
                        "definition": "Withdraw from a position or demand",
                        "example": "They refused to back down from their offer."
                    },
                    {
                        "term": "Come around",
                        "definition": "Change opinion or agree eventually",
                        "example": "I think they'll come around to our proposal."
                    },
                    {
                        "term": "Hold out for",
                        "definition": "Wait persistently for something better",
                        "example": "We should hold out for a better deal."
                    }
                ]
            }
        },
        # Advanced lesson
        {
            "id": "advanced-1",
            "levelId": "advanced",
            "title": "Executive Idioms",
            "description": "High-level business idioms for leadership",
            "type": "idioms",
            "points": 200,
            "order": 1,
            "content": {
                "vocabulary": [
                    {
                        "term": "Think outside the box",
                        "definition": "Approach problems creatively",
                        "example": "We need to think outside the box for this solution."
                    },
                    {
                        "term": "Low-hanging fruit",
                        "definition": "Easy targets or quick wins",
                        "example": "Let's focus on the low-hanging fruit first."
                    },
                    {
                        "term": "Move the needle",
                        "definition": "Make a significant impact",
                        "example": "This initiative should really move the needle."
                    },
                    {
                        "term": "Boil the ocean",
                        "definition": "Attempt something overly ambitious",
                        "example": "We're not trying to boil the ocean here."
                    }
                ]
            }
        }
    ]
    
    await db.database.lessons.insert_many(lessons)
    
    # Seed quizzes
    quizzes = [
        {
            "lessonId": "beginner-1",
            "questions": [
                {
                    "id": "q1",
                    "question": "What does 'Let's get started' mean in a business context?",
                    "options": ["End the meeting", "Begin a meeting", "Take a break", "Schedule later"],
                    "correct": 1,
                    "explanation": "'Let's get started' is used to begin a meeting or discussion."
                },
                {
                    "id": "q2",
                    "question": "Complete the sentence: 'Let's _____ back on this topic next week.'",
                    "options": ["circle", "square", "triangle", "round"],
                    "correct": 0,
                    "explanation": "'Circle back' means to return to discuss something later."
                }
            ]
        },
        {
            "lessonId": "beginner-2",
            "questions": [
                {
                    "id": "q1",
                    "question": "Which phrase is used to mention email attachments?",
                    "options": ["Please find attached", "Please see below", "As mentioned above", "Please note that"],
                    "correct": 0,
                    "explanation": "'Please find attached' is the formal way to mention attachments."
                }
            ]
        }
    ]
    
    await db.database.quizzes.insert_many(quizzes)
    
    # Seed achievements
    achievements = [
        {
            "id": "first_lesson",
            "name": "First Steps",
            "description": "Complete your first lesson",
            "icon": "🎯",
            "points": 50
        },
        {
            "id": "streak_3",
            "name": "Getting Consistent",
            "description": "Maintain a 3-day learning streak",
            "icon": "🔥",
            "points": 100
        },
        {
            "id": "phrasal_master",
            "name": "Phrasal Verb Master",
            "description": "Complete 5 phrasal verb lessons",
            "icon": "⭐",
            "points": 200
        },
        {
            "id": "perfect_score",
            "name": "Perfect Score",
            "description": "Get 100% on a quiz",
            "icon": "💯",
            "points": 150
        }
    ]
    
    await db.database.achievements.insert_many(achievements)