import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Flame, Star, LogOut, User } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [levelsResponse, achievementsResponse] = await Promise.all([
        axios.get(`${API}/levels`),
        axios.get(`${API}/achievements`)
      ]);
      
      setLevels(levelsResponse.data);
      setAchievements(achievementsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelClick = async (levelId) => {
    try {
      const response = await axios.get(`${API}/levels/${levelId}/lessons`);
      const lessons = response.data;
      if (lessons.length > 0) {
        navigate(`/lesson/${levelId}/${lessons[0].id}`);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const getCompletedLessonsForLevel = (levelId) => {
    if (!user) return 0;
    // This would ideally come from the stats API, but for now we'll estimate
    return user.completedLessons.filter(lessonId => lessonId.startsWith(levelId)).length;
  };

  const getProgressPercentage = (level) => {
    const completed = getCompletedLessonsForLevel(level.id);
    return level.totalLessons > 0 ? (completed / level.totalLessons) * 100 : 0;
  };

  const getUserAchievements = () => {
    if (!user || !achievements) return [];
    return user.achievements.map(achievementId => 
      achievements.find(a => a.id === achievementId)
    ).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userAchievements = getUserAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BusinessEnglish Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/profile')} className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{user?.firstName}</span>
              </Button>
              <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">Ready to enhance your business English skills today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Points</p>
                  <p className="text-3xl font-bold">{user?.points || 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Streak</p>
                  <p className="text-3xl font-bold">{user?.streak || 0} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold">{user?.completedLessons?.length || 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Achievements</p>
                  <p className="text-3xl font-bold">{user?.achievements?.length || 0}</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Levels */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Level</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {levels.map((level, index) => {
              const progress = getProgressPercentage(level);
              const completed = getCompletedLessonsForLevel(level.id);
              
              return (
                <Card 
                  key={level.id} 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  onClick={() => handleLevelClick(level.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{level.icon}</span>
                      <Badge variant="secondary">{completed}/{level.totalLessons} lessons</Badge>
                    </div>
                    <CardTitle className="text-xl">{level.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-600 mb-4">{level.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>📚 {level.totalLessons} lessons</span>
                      <span>⏱️ {level.estimatedTime}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        {userAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {userAchievements.slice(-3).map((achievement) => (
                <Card key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-orange-600 font-medium">+{achievement.points} points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;