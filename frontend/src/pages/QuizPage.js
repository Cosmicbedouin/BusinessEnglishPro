import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../data/mock';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Target } from 'lucide-react';

const QuizPage = () => {
  const { levelId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserProgress } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lesson = mockData.lessons[levelId]?.find(l => l.id === lessonId);
  const level = mockData.difficultyLevels.find(l => l.id === levelId);
  const quiz = mockData.quizzes[lessonId] || [];

  useEffect(() => {
    if (!lesson || !level || quiz.length === 0) {
      navigate('/dashboard');
    }
  }, [lesson, level, quiz, navigate]);

  if (!lesson || !level || quiz.length === 0) {
    return null;
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === currentQuestion.correct;
    const newAnswer = {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correct,
      isCorrect
    };

    setAnswers([...answers, newAnswer]);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const finalScore = score + (selectedAnswer === currentQuestion.correct ? 1 : 0);
    const percentage = (finalScore / quiz.length) * 100;
    
    let bonusPoints = 0;
    let newAchievements = [];

    // Award points based on performance
    if (percentage >= 90) {
      bonusPoints = 150;
    } else if (percentage >= 70) {
      bonusPoints = 100;
    } else if (percentage >= 50) {
      bonusPoints = 50;
    }

    // Check for achievements
    if (percentage === 100) {
      newAchievements.push('perfect_score');
    }

    updateUserProgress(`quiz-${lessonId}`, bonusPoints, newAchievements);
    setQuizCompleted(true);

    toast({
      title: "Quiz Completed!",
      description: `You scored ${finalScore}/${quiz.length} and earned ${bonusPoints} points!`,
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (quizCompleted) {
    const finalScore = answers.filter(a => a.isCorrect).length;
    const percentage = (finalScore / quiz.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-gray-900">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                  {finalScore}/{quiz.length}
                </div>
                <div className="text-sm text-gray-500">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                  {Math.round(percentage)}%
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  +{percentage >= 90 ? 150 : percentage >= 70 ? 100 : percentage >= 50 ? 50 : 0}
                </div>
                <div className="text-sm text-gray-500">Points Earned</div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Feedback</h3>
              {percentage >= 90 && (
                <p className="text-green-600">🎉 Excellent! You've mastered this content.</p>
              )}
              {percentage >= 70 && percentage < 90 && (
                <p className="text-blue-600">👍 Great job! You have a solid understanding.</p>
              )}
              {percentage >= 50 && percentage < 70 && (
                <p className="text-yellow-600">📚 Good effort! Consider reviewing the lesson again.</p>
              )}
              {percentage < 50 && (
                <p className="text-red-600">💪 Keep practicing! Review the lesson and try again.</p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/lesson/${levelId}/${lessonId}`)}
                className="flex-1"
              >
                Review Lesson
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Quiz: {lesson.title}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge className={`bg-gradient-to-r ${level.color} text-white`}>
              {level.name}
            </Badge>
            <Badge variant="outline">Quiz</Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Your Knowledge</h1>
          <p className="text-gray-600 mb-4">Answer the questions to complete your lesson</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {quiz.length}
            </span>
            <span className="text-sm text-gray-500">
              Score: {score}/{currentQuestionIndex + (showResult && selectedAnswer === currentQuestion.correct ? 1 : 0)}
            </span>
          </div>
          
          <Progress value={progress} className="mt-4 h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ";
              
              if (showResult) {
                if (index === currentQuestion.correct) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && index !== currentQuestion.correct) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              } else {
                if (index === selectedAnswer) {
                  buttonClass += "border-blue-500 bg-blue-50 text-blue-800";
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correct && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                      <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Explanation Card */}
        {showResult && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center">
          {!showResult ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {currentQuestionIndex === quiz.length - 1 ? 'Complete Quiz' : 'Next Question'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;