import { Link } from 'react-router-dom';
import { Dumbbell, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-500 rounded-lg p-1.5">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Wilarix Workout</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Start small. Stay consistent. Transform your body. Built for beginners who are serious about change.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Pages</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">About</Link>
              <Link to="/how-it-works" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">How It Works</Link>
              <Link to="/benefits" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Benefits</Link>
              <Link to="/contact" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Workouts</h4>
            <div className="flex flex-col gap-2">
              <Link to="/session/warmup" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Warm-Up</Link>
              <Link to="/session/session1" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Session 1 — Full Body</Link>
              <Link to="/session/session2" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Session 2 — Dumbbells</Link>
              <Link to="/session/session3" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Session 3 — Abs & Core</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex items-center justify-center gap-1 text-gray-500 text-xs">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>for your fitness journey · Wilarix Basic Workout © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
