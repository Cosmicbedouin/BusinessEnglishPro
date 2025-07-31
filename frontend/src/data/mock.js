export const mockData = {
  users: [
    {
      id: 1,
      email: 'demo@example.com',
      firstName: 'Demo',
      level: 'Intermediate',
      points: 1250,
      streak: 7,
      completedLessons: ['beginner-1', 'beginner-2', 'intermediate-1'],
      achievements: ['first_lesson', 'streak_3', 'phrasal_master']
    }
  ],

  difficultyLevels: [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Essential business phrases and basic collocations',
      color: 'from-emerald-500 to-teal-600',
      icon: '🌱',
      totalLessons: 12,
      estimatedTime: '2-3 weeks'
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Complex phrasal verbs and professional idioms',
      color: 'from-blue-500 to-indigo-600',
      icon: '📈',
      totalLessons: 15,
      estimatedTime: '3-4 weeks'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Executive-level expressions and nuanced communication',
      color: 'from-purple-500 to-pink-600',
      icon: '🏆',
      totalLessons: 18,
      estimatedTime: '4-5 weeks'
    }
  ],

  lessons: {
    beginner: [
      {
        id: 'beginner-1',
        title: 'Meeting Essentials',
        description: 'Key phrases for professional meetings',
        type: 'phrases',
        points: 100,
        content: {
          vocabulary: [
            { term: 'Let\'s get started', definition: 'Begin a meeting or discussion', example: 'Let\'s get started with today\'s agenda.' },
            { term: 'Moving forward', definition: 'Continuing with plans or progress', example: 'Moving forward, we need to focus on quality.' },
            { term: 'Circle back', definition: 'Return to discuss something later', example: 'Let\'s circle back on this topic next week.' },
            { term: 'Touch base', definition: 'Make contact or check in briefly', example: 'I\'ll touch base with you on Friday.' }
          ]
        }
      },
      {
        id: 'beginner-2',
        title: 'Email Fundamentals',
        description: 'Professional email collocations and phrases',
        type: 'collocations',
        points: 100,
        content: {
          vocabulary: [
            { term: 'Please find attached', definition: 'Formal way to mention attachments', example: 'Please find attached the quarterly report.' },
            { term: 'As discussed', definition: 'Referring to previous conversation', example: 'As discussed in our meeting yesterday...' },
            { term: 'Follow up on', definition: 'Continue or check progress on something', example: 'I wanted to follow up on our proposal.' },
            { term: 'Keep me posted', definition: 'Inform me of updates', example: 'Please keep me posted on the project status.' }
          ]
        }
      }
    ],
    intermediate: [
      {
        id: 'intermediate-1',
        title: 'Negotiation Phrasal Verbs',
        description: 'Essential phrasal verbs for business negotiations',
        type: 'phrasal_verbs',
        points: 150,
        content: {
          vocabulary: [
            { term: 'Bring up', definition: 'Introduce a topic for discussion', example: 'I\'d like to bring up the budget concerns.' },
            { term: 'Back down', definition: 'Withdraw from a position or demand', example: 'They refused to back down from their offer.' },
            { term: 'Come around', definition: 'Change opinion or agree eventually', example: 'I think they\'ll come around to our proposal.' },
            { term: 'Hold out for', definition: 'Wait persistently for something better', example: 'We should hold out for a better deal.' }
          ]
        }
      }
    ],
    advanced: [
      {
        id: 'advanced-1',
        title: 'Executive Idioms',
        description: 'High-level business idioms for leadership',
        type: 'idioms',
        points: 200,
        content: {
          vocabulary: [
            { term: 'Think outside the box', definition: 'Approach problems creatively', example: 'We need to think outside the box for this solution.' },
            { term: 'Low-hanging fruit', definition: 'Easy targets or quick wins', example: 'Let\'s focus on the low-hanging fruit first.' },
            { term: 'Move the needle', definition: 'Make a significant impact', example: 'This initiative should really move the needle.' },
            { term: 'Boil the ocean', definition: 'Attempt something overly ambitious', example: 'We\'re not trying to boil the ocean here.' }
          ]
        }
      }
    ]
  },

  quizzes: {
    'beginner-1': [
      {
        id: 'q1',
        question: 'What does "Let\'s get started" mean in a business context?',
        options: ['End the meeting', 'Begin a meeting', 'Take a break', 'Schedule later'],
        correct: 1,
        explanation: '"Let\'s get started" is used to begin a meeting or discussion.'
      },
      {
        id: 'q2',
        question: 'Complete the sentence: "Let\'s _____ back on this topic next week."',
        options: ['circle', 'square', 'triangle', 'round'],
        correct: 0,
        explanation: '"Circle back" means to return to discuss something later.'
      }
    ],
    'beginner-2': [
      {
        id: 'q1',
        question: 'Which phrase is used to mention email attachments?',
        options: ['Please find attached', 'Please see below', 'As mentioned above', 'Please note that'],
        correct: 0,
        explanation: '"Please find attached" is the formal way to mention attachments.'
      }
    ]
  },

  achievements: [
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      points: 50
    },
    {
      id: 'streak_3',
      name: 'Getting Consistent',
      description: 'Maintain a 3-day learning streak',
      icon: '🔥',
      points: 100
    },
    {
      id: 'phrasal_master',
      name: 'Phrasal Verb Master',
      description: 'Complete 5 phrasal verb lessons',
      icon: '⭐',
      points: 200
    }
  ]
};