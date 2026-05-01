import { Link } from 'react-router-dom';
import { Flame, Zap, Target, Clock, Shield, TrendingUp, ChevronRight, Play, Star } from 'lucide-react';

const benefits = [
  { icon: Flame, title: 'Burn Fat', desc: 'Structured cardio and strength sessions designed to maximize calorie burn for beginners.' },
  { icon: Zap, title: 'Build Energy', desc: 'Consistent training boosts your metabolism and daily energy levels within weeks.' },
  { icon: Target, title: 'Stay Focused', desc: 'Simple goals and progress tracking keep you locked in and motivated every day.' },
  { icon: Clock, title: 'Save Time', desc: 'All sessions are 20–30 minutes. No gym membership or commute required.' },
  { icon: Shield, title: 'Beginner Safe', desc: 'Every exercise comes with safety tips, beginner modifications, and rest timers.' },
  { icon: TrendingUp, title: 'See Progress', desc: 'Track your weight, streak, and completed workouts to witness your transformation.' },
];

const steps = [
  { num: '01', title: 'Create Free Account', desc: 'Sign up in seconds — just your name and email.' },
  { num: '02', title: 'Start Today\'s Workout', desc: 'Your dashboard shows exactly what to do. No guessing.' },
  { num: '03', title: 'Follow Along', desc: 'Video demos, timers, and clear instructions guide every move.' },
  { num: '04', title: 'Track Your Progress', desc: 'Log your weight, note your wins, and watch your streak grow.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 text-xs font-medium uppercase tracking-wider">Free • No Equipment Needed • Beginner Friendly</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Wilarix<br />
            <span className="text-orange-500">Basic Workout</span>
          </h1>
          <p className="text-xl sm:text-2xl text-orange-200 font-light mb-3 italic">
            "Start small. Stay consistent. Transform your body."
          </p>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            A simple home workout app designed for complete beginners who want to lose weight, build healthy habits, and feel stronger — without a gym or complicated programs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25 flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> Start Today's Workout
            </Link>
            <Link
              to="/how-it-works"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-2xl transition-colors flex items-center gap-2"
            >
              How It Works <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center">
            {[['3', 'Workout Sessions'], ['20–30', 'Min Per Session'], ['0', 'Equipment Needed'], ['100%', 'Beginner Friendly']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-black text-orange-400">{val}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">Why Wilarix Works</h2>
          <p className="text-gray-400 max-w-md mx-auto">Everything you need, nothing you don't. Designed for real people starting their fitness journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
              <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-white font-bold mb-1.5">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Get Started in 4 Steps</h2>
            <p className="text-gray-400">No confusion. No complicated setup. Just start moving.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <span className="text-4xl font-black text-orange-500/30 leading-none flex-shrink-0">{num}</span>
                <div>
                  <h3 className="text-white font-bold mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After motivation */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-900/20 to-gray-900 border border-orange-500/20 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Your Transformation Starts Now</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Every person who is fit today was once exactly where you are. The difference? They started.
            Wilarix Basic Workout gives you a structured, beginner-safe path to a stronger, healthier body —
            one session at a time.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
            {[['Week 1', 'Build the habit', 'orange'], ['Week 4', 'Feel the change', 'yellow'], ['Week 8', 'See the results', 'green']].map(([period, text, color]) => (
              <div key={period} className="text-center">
                <div className={`text-${color}-400 font-black text-lg mb-0.5`}>{period}</div>
                <div className="text-gray-400 text-xs">{text}</div>
              </div>
            ))}
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
          >
            Start My Journey — It's Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
