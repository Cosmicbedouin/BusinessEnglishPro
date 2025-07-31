from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# User Models
class UserBase(BaseModel):
    email: EmailStr
    firstName: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    level: str = "Beginner"
    points: int = 0
    streak: int = 0
    completedLessons: List[str] = []
    achievements: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    email: str
    firstName: str
    level: str
    points: int
    streak: int
    completedLessons: List[str]
    achievements: List[str]

# Content Models
class VocabularyItem(BaseModel):
    term: str
    definition: str
    example: str

class LessonContent(BaseModel):
    vocabulary: List[VocabularyItem]

class Lesson(BaseModel):
    id: str
    levelId: str
    title: str
    description: str
    type: str  # phrases, phrasal_verbs, collocations, idioms
    points: int
    content: LessonContent
    order: int = 0

class DifficultyLevel(BaseModel):
    id: str
    name: str
    description: str
    color: str
    icon: str
    totalLessons: int
    estimatedTime: str

# Quiz Models
class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correct: int
    explanation: str

class Quiz(BaseModel):
    lessonId: str
    questions: List[QuizQuestion]

class QuizSubmission(BaseModel):
    lessonId: str
    answers: List[Dict[str, Any]]
    score: int
    totalQuestions: int

# Achievement Models
class Achievement(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    points: int

# Progress Models
class ProgressUpdate(BaseModel):
    lessonId: str
    points: int
    achievements: List[str] = []

class UserStats(BaseModel):
    totalPoints: int
    streak: int
    completedLessons: int
    achievements: int
    levelProgress: Dict[str, Dict[str, Any]]

# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str = None