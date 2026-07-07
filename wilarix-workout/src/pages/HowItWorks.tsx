import { Link } from 'react-router-dom';
import { UserPlus, LayoutDashboard, PlayCircle, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    num: '01',
    title: 'Create Your Free Account',
    desc: 'Sign up with your name and email. No credit card, no complicated forms. You\'re in within 30 seconds.',
    color: 'orange',
  },
  {
    icon: LayoutDashboard,
    num: '02',
    title: 'Check Your Dashboard',
    desc: 'After login, your dashboard shows today\'s recommended workout, your streak, and your progress stats — all in one place.',
    color: 'blue',
  },
  {
    icon: PlayCircle,
    num: '03',
    title: 'Follow the Workout',
    desc: 'Tap a session to start. Watch the video demo, follow the timer, complete each exercise, rest when told. It\'s that simple.',
    color: 'green',
  },
  {
    icon: BarChart3,
    num: '04',
    title: 'Track Your Progress',
    desc: 'Log your weight, write session notes, and watch your streak climb. See how far you\'ve come and keep going.',
    color: 'purple',
  },
];

const sessions = [
  {
    name: 'Warm-Up',
    emoji: '🔥',
    duration: '5 min',
    desc: 'Light movement — marching, arm circles, hip rotations. Always do this first to prevent injury.',
  },
  {
    name: 'Session 1 — Full Body Basics',
    emoji: '💪',
    duration: '20 min',
    desc: 'Jump rope + 3 no-equipment exercises: squats, push-ups, and glute bridges. Perfect for absolute beginners.',
  },
  {
    name: 'Session 2 — Dumbbell Strength',
    emoji: '🏋️',
    duration: '30 min',
    desc: 'Jump rope + 5 dumbbell exercises targeting your whole body. Light weights, big results.',
  },
  {
    name: 'Session 3 — Abs & Core',
    emoji: '⚡',
    duration: '25 min',
    desc: 'Jump rope + 4 core exercises: crunches, planks, bicycle crunches, leg raises. Build your foundation.',
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-3">How Wilarix Works</h1>
        <p className="text-gray-400 text-lg">Simple steps. Clear progress. Real results.</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4 mb-10">
        {steps.map(({ icon: Icon, num, title, desc, color }) => (
          <div key={num} className="flex gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center mb-1`}>
                <Icon className={`w-5 h-5 text-${color}-400`} />
              </div>
              <span className={`text-${color}-500/50 text-xs font-black`}>{num}</span>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions overview */}
      <h2 className="text-white font-black text-xl mb-4">The Workout Sessions</h2>
      <div className="flex flex-col gap-3 mb-8">
        {sessions.map(s => (
          <div key={s.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4">
            <span className="text-2xl flex-shrink-0">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-white font-bold text-sm">{s.name}</h3>
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{s.duration}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-900/20 to-gray-900 border border-orange-500/20 rounded-2xl p-6 text-center">
        <h2 className="text-white font-black text-xl mb-2">Start Today</h2>
        <p className="text-gray-400 mb-4">The best workout is the one you actually do.</p>
        <Link to="/signup" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Create Free Account
        </Link>
      </div>
    </div>
  );
}
