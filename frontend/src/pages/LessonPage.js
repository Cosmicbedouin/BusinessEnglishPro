import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, ArrowRight, BookOpen, Trophy, Volume2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LessonPage = () => {
  const { levelId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserProgress } = useAuth();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      const [lessonResponse, levelsResponse] = await Promise.all([
        axios.get(`${API}/lessons/${lessonId}`),
        axios.get(`${API}/levels`)
      ]);
      
      setLesson(lessonResponse.data);
      setLevels(levelsResponse.data);
    } catch (error) {
      console.error('Failed to fetch lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const level = levels.find(l => l.id === levelId);
  const vocabulary = lesson.content.vocabulary;
  const currentItem = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDefinition(false);
    } else {
      // Lesson completed
      completeLesson();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDefinition(false);
    }
  };

  const completeLesson = async () => {
    if (!user.completedLessons.includes(lessonId)) {
      const newAchievements = [];
      
      // Check for first lesson achievement
      if (user.completedLessons.length === 0) {
        newAchievements.push('first_lesson');
      }
      
      await updateUserProgress(lessonId, lesson.points, newAchievements);
    }
    navigate(`/quiz/${levelId}/${lessonId}`);
  };

  const goToQuiz = () => {
    navigate(`/quiz/${levelId}/${lessonId}`);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">{lesson.title}</span>
              </div>
              <Button 
                onClick={goToQuiz}
                className="bg-green-600 hover:bg-green-700"
              >
                Take Quiz
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            {level && (
              <Badge className={`bg-gradient-to-r ${level.color} text-white`}>
                {level.name}
              </Badge>
            )}
            <Badge variant="outline">
              {lesson.type.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {vocabulary.length} terms
            </span>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{lesson.points} points</span>
            </div>
          </div>
          
          <Progress value={progress} className="mt-4 h-2" />
        </div>

        {/* Learning Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-blue-600 mb-2">
              {currentItem.term}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText(currentItem.term)}
              className="w-fit mx-auto"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Pronounce
            </Button>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            {!showDefinition ? (
              <div>
                <p className="text-gray-600 mb-6">
                  What does this business term mean?
                </p>
                <Button
                  onClick={() => setShowDefinition(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Show Definition
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Definition</h3>
                  <p className="text-gray-700">{currentItem.definition}</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Example Usage</h3>
                  <p className="text-gray-700 italic">"{currentItem.example}"</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakText(currentItem.example)}
                    className="mt-3"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Hear Example
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            disabled={!showDefinition}
          >
            <span>{currentIndex === vocabulary.length - 1 ? 'Complete Lesson' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentIndex + 1}</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
            <div className="text-gray-300">/</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{vocabulary.length}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;