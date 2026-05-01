import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const perks = ['Free forever', 'No credit card needed', 'Start in 60 seconds'];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-2xl mb-4">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Join Wilarix Workout</h1>
          <p className="text-gray-400 mt-1">Your transformation starts with one step.</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            {perks.map(p => (
              <span key={p} className="flex items-center gap-1 text-green-400 text-xs">
                <CheckCircle2 className="w-3 h-3" /> {p}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First and last name"
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-11 outline-none transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-600 text-xs mt-1">Minimum 6 characters</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-1"
            >
              {loading ? 'Creating account…' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">Log in</Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          By signing up you agree to use this app responsibly. Always consult a doctor before starting a new exercise program.
        </p>
      </div>
    </div>
  );
}
