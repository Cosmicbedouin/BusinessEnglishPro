# API Contracts & Integration Plan

## Overview
This document outlines the API contracts, mock data replacement strategy, and frontend-backend integration for the Business English learning app.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile with stats
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/progress` - Update user learning progress

### Content Management
- `GET /api/levels` - Get all difficulty levels
- `GET /api/levels/:levelId/lessons` - Get lessons for a level
- `GET /api/lessons/:lessonId` - Get specific lesson content
- `GET /api/lessons/:lessonId/quiz` - Get quiz for lesson

### Progress & Gamification
- `POST /api/progress/lesson/:lessonId` - Mark lesson as completed
- `POST /api/progress/quiz/:lessonId` - Submit quiz results
- `GET /api/achievements` - Get user achievements
- `GET /api/stats` - Get user learning statistics

## Database Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  firstName: String,
  password: String (hashed),
  level: String, // current learning level
  points: Number,
  streak: Number,
  completedLessons: [String], // lesson IDs
  achievements: [String], // achievement IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson
```javascript
{
  _id: ObjectId,
  id: String (unique),
  levelId: String,
  title: String,
  description: String,
  type: String, // phrases, phrasal_verbs, collocations, idioms
  points: Number,
  content: {
    vocabulary: [{
      term: String,
      definition: String,
      example: String
    }]
  },
  order: Number
}
```

### Quiz
```javascript
{
  _id: ObjectId,
  lessonId: String,
  questions: [{
    id: String,
    question: String,
    options: [String],
    correct: Number,
    explanation: String
  }]
}
```

### Achievement
```javascript
{
  _id: ObjectId,
  id: String (unique),
  name: String,
  description: String,
  icon: String,
  points: Number,
  criteria: Object // achievement unlock criteria
}
```

## Mock Data Replacement Strategy

### Current Mock Data (`/src/data/mock.js`)
1. **Static user data** → Replace with JWT-based authentication
2. **Difficulty levels** → Store in database, serve via API
3. **Lesson content** → Store in MongoDB, serve via API endpoints
4. **Quiz questions** → Store in database, link to lessons
5. **Achievements system** → Database-driven with unlock logic

### Frontend Integration Changes

#### Authentication Context (`/src/contexts/AuthContext.js`)
- Replace localStorage simulation with JWT token management
- Update login/signup to call real API endpoints
- Add token refresh logic
- Handle authentication errors properly

#### Data Fetching
- Replace direct mock data imports with axios API calls
- Add loading states and error handling
- Implement proper caching where needed

#### Components Requiring Updates
1. **Dashboard.js**: Fetch real user stats and progress
2. **LessonPage.js**: Load lesson content from API
3. **QuizPage.js**: Submit real quiz results to backend
4. **ProfilePage.js**: Display real user achievements and stats

## Integration Steps

### Phase 1: Backend Setup
1. Create MongoDB models for User, Lesson, Quiz, Achievement
2. Implement authentication middleware with JWT
3. Create CRUD endpoints for all entities
4. Seed database with initial content

### Phase 2: Frontend Integration
1. Update AuthContext to use real authentication
2. Replace mock data calls with API calls
3. Add proper error handling and loading states
4. Update progress tracking to persist to database

### Phase 3: Data Migration
1. Migrate mock lesson content to database
2. Set up quiz questions in MongoDB
3. Configure achievements system
4. Test full user journey

## Security Considerations
- JWT token management
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration

## Error Handling
- Standardized error response format
- Frontend error boundaries
- User-friendly error messages
- Logging for debugging

This contract ensures seamless transition from mock data to fully functional backend while maintaining all existing frontend functionality.