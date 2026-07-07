import { Link } from 'react-router-dom';
import { Dumbbell, Heart, Target, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">About Wilarix Basic Workout</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          A simple, beginner-focused fitness app built for real people who want to change their lives — not fitness experts.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-black text-xl mb-3">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          Wilarix Basic Workout was created with one goal: to make fitness accessible to everyone, regardless of experience, equipment, or budget.
        </p>
        <p className="text-gray-300 leading-relaxed">
          We believe the biggest obstacle to getting fit isn't willpower — it's not knowing where to start. Our structured sessions, video demonstrations, and progress tracking remove all the confusion so you can focus on what matters: showing up and putting in the work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Heart, title: 'Made for Beginners', desc: 'No fitness background required. Every exercise is explained clearly with beginner modifications.' },
          { icon: Target, title: 'Goal-Oriented', desc: 'Structured sessions with clear objectives — lose weight, build strength, improve discipline.' },
          { icon: Users, title: 'For Everyone', desc: 'At home, at any time, with zero equipment needed for Session 1. Completely free to start.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-white font-bold mb-1.5 text-sm">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-900/20 to-gray-900 border border-orange-500/20 rounded-2xl p-6 text-center">
        <h2 className="text-white font-black text-xl mb-2">Ready to Start?</h2>
        <p className="text-gray-400 mb-4">Join for free and take the first step toward your transformation.</p>
        <Link to="/signup" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Get Started — It's Free
        </Link>
      </div>
    </div>
  );
}
