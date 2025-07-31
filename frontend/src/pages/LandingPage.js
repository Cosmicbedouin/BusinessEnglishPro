import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { BookOpen, Target, TrendingUp, Users, Clock, Star, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', firstName: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: result.error || "Please check your credentials.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await signup(signupForm.email, signupForm.firstName, signupForm.password);
    
    if (result.success) {
      toast({
        title: "Account created!",
        description: "Welcome to Business English Mastery.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Signup failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BusinessEnglish Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                About
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Features
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              For Busy Professionals
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Business English
              <span className="text-blue-600 block">in Minutes a Day</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Gamified learning platform designed for non-native speakers to master business phrases, 
              phrasal verbs, collocations, and idioms that matter in professional settings.
            </p>
          </div>

          {/* Auth Section */}
          <div className="max-w-md mx-auto mb-16">
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Get Started Today</CardTitle>
                <CardDescription>Join thousands of professionals improving their business English</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signup" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <Input
                        placeholder="First Name"
                        value={signupForm.firstName}
                        onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Start Learning Now'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                      <p className="text-sm text-gray-500 text-center">
                        Demo: demo@example.com / password
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Professionals Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed specifically for busy professionals who need efficient, practical business English skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="h-12 w-12 text-blue-600" />,
                title: "Targeted Learning",
                description: "Focus on business-specific phrases, phrasal verbs, and idioms that matter in professional settings"
              },
              {
                icon: <Zap className="h-12 w-12 text-green-600" />,
                title: "Gamified Experience",
                description: "Earn points, maintain streaks, and unlock achievements to stay motivated"
              },
              {
                icon: <Clock className="h-12 w-12 text-purple-600" />,
                title: "Time-Efficient",
                description: "Short, focused lessons designed for busy schedules - learn in just 10-15 minutes daily"
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-orange-600" />,
                title: "Progressive Difficulty",
                description: "Start with basics and advance through beginner, intermediate, and advanced levels"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600">
              Progress from basic business phrases to advanced executive communication
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                level: "Beginner",
                icon: "🌱",
                color: "from-emerald-500 to-teal-600",
                description: "Essential business phrases and basic collocations for everyday professional interactions",
                lessons: 12,
                duration: "2-3 weeks"
              },
              {
                level: "Intermediate",
                icon: "📈",
                color: "from-blue-500 to-indigo-600",
                description: "Complex phrasal verbs and professional idioms for confident business communication",
                lessons: 15,
                duration: "3-4 weeks"
              },
              {
                level: "Advanced",
                icon: "🏆",
                color: "from-purple-500 to-pink-600",
                description: "Executive-level expressions and nuanced communication for leadership roles",
                lessons: 18,
                duration: "4-5 weeks"
              }
            ].map((level, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardHeader className="relative">
                  <div className="text-4xl mb-2">{level.icon}</div>
                  <CardTitle className="text-2xl">{level.level}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{level.lessons} lessons</span>
                    <span>{level.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Learners" },
              { number: "500+", label: "Business Phrases" },
              { number: "95%", label: "Completion Rate" },
              { number: "4.8★", label: "User Rating" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">BusinessEnglish Pro</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering professionals worldwide with essential business English skills
          </p>
          <div className="text-sm text-gray-500">
            © 2025 BusinessEnglish Pro. Built for busy professionals who want to excel.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;