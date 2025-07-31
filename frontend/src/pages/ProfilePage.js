import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../data/mock';
import { ArrowLeft, Trophy, Flame, Star, BookOpen, Calendar, Target } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getUserAchievements = () => {
    return user.achievements.map(achievementId => 
      mockData.achievements.find(a => a.id === achievementId)
    ).filter(Boolean);
  };

  const getCompletedLessonsByLevel = () => {
    const stats = {};
    Object.keys(mockData.lessons).forEach(levelId => {
      const levelLessons = mockData.lessons[levelId];
      const completed = levelLessons.filter(lesson => 
        user.completedLessons.includes(lesson.id)
      ).length;
      stats[levelId] = {
        completed,
        total: levelLessons.length
      };
    });
    return stats;
  };

  const levelStats = getCompletedLessonsByLevel();
  const achievements = getUserAchievements();

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
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">
              {user.firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.firstName}'s Profile
          </h1>
          <p className="text-gray-600">{user.email}</p>
          <Badge className="mt-2 bg-blue-100 text-blue-800">
            {user.level} Level
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{user.points}</div>
              <div className="text-sm text-gray-500">Total Points</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{user.streak}</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{user.completedLessons.length}</div>
              <div className="text-sm text-gray-500">Lessons Completed</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{achievements.length}</div>
              <div className="text-sm text-gray-500">Achievements</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.difficultyLevels.map(level => {
                const stats = levelStats[level.id];
                const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                
                return (
                  <div key={level.id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{level.icon}</span>
                        <span className="font-medium">{level.name}</span>
                      </div>
                      <Badge variant="outline">
                        {stats.completed}/{stats.total}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${level.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {Math.round(percentage)}% complete
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        +{achievement.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements yet</p>
                  <p className="text-sm text-gray-400">Complete lessons to earn your first achievement!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">Account Information</h3>
                <p className="text-sm text-gray-500">
                  Joined {new Date().toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;