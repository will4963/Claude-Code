import { Link } from 'react-router-dom';

const benefits = [
  {
    emoji: '🔥',
    title: 'Accelerated Fat Loss',
    desc: 'Consistent cardio and strength training increases your metabolism. Your body burns more calories even while resting after just a few weeks of regular training.',
    week: 'Noticeable within: 2–4 weeks',
  },
  {
    emoji: '💪',
    title: 'Increased Muscle Tone',
    desc: 'Even beginner-level strength training builds lean muscle. More muscle means a firmer, more defined body — and a faster metabolism that works for you 24/7.',
    week: 'Noticeable within: 4–6 weeks',
  },
  {
    emoji: '🧠',
    title: 'Mental Clarity & Mood Boost',
    desc: 'Exercise releases endorphins — your brain\'s natural feel-good chemicals. Regular workouts reduce stress, anxiety, and mental fog. You\'ll feel sharper and happier.',
    week: 'Noticeable within: 1–2 weeks',
  },
  {
    emoji: '⚡',
    title: 'More Energy Every Day',
    desc: 'It sounds counterintuitive, but expending energy through exercise gives you more energy. Regular training improves cardiovascular efficiency and reduces fatigue.',
    week: 'Noticeable within: 2–3 weeks',
  },
  {
    emoji: '😴',
    title: 'Better Sleep Quality',
    desc: 'Regular exercise helps regulate your sleep cycle. You\'ll fall asleep faster, sleep deeper, and wake up feeling genuinely rested.',
    week: 'Noticeable within: 1–2 weeks',
  },
  {
    emoji: '🏃',
    title: 'Stronger Heart & Lungs',
    desc: 'Cardio workouts like jump rope strengthen your cardiovascular system. Climbing stairs, playing with kids, or walking up hills becomes easier every week.',
    week: 'Noticeable within: 3–5 weeks',
  },
  {
    emoji: '🎯',
    title: 'Discipline & Willpower',
    desc: 'The discipline you build in fitness transfers to every area of your life. Showing up for your workouts trains your brain to follow through on commitments.',
    week: 'Noticeable within: 2–4 weeks',
  },
  {
    emoji: '🦴',
    title: 'Stronger Bones & Joints',
    desc: 'Resistance training increases bone density and strengthens the connective tissue around joints. This protects you from injury and reduces aches as you age.',
    week: 'Noticeable within: 6–8 weeks',
  },
  {
    emoji: '❤️',
    title: 'Longer, Healthier Life',
    desc: 'Regular exercise is one of the most powerful preventative health measures available. It reduces risk of heart disease, diabetes, and many other chronic conditions.',
    week: 'Long-term investment',
  },
];

export default function Benefits() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-3">Benefits of Consistent Training</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Consistency is the secret ingredient. Here's what happens to your body and mind when you commit to showing up.
        </p>
      </div>

      <div className="bg-orange-900/20 border border-orange-500/20 rounded-2xl p-4 mb-8 text-center">
        <p className="text-orange-300 font-semibold text-sm">
          "You don't have to be great to start, but you have to start to be great." — Zig Ziglar
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {benefits.map(({ emoji, title, desc, week }) => (
          <div key={title} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500/20 transition-colors">
            <div className="text-2xl mb-2">{emoji}</div>
            <h3 className="text-white font-bold mb-1.5">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">{desc}</p>
            <span className="text-green-400 text-xs font-medium">{week}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-black text-xl mb-3">The Compound Effect</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          One workout won't change your body. But 30 workouts will. The magic of consistent exercise is that the benefits compound — each session makes the next one a little easier, and the results a little more visible.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Most beginners quit in the first two weeks because they don't see results yet. The ones who persist past that point are the ones who transform. Wilarix keeps you accountable with streaks, progress tracking, and structured sessions so you never lose momentum.
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-900/20 to-gray-900 border border-orange-500/20 rounded-2xl p-6 text-center">
        <h2 className="text-white font-black text-xl mb-2">Start Collecting These Benefits Today</h2>
        <p className="text-gray-400 mb-4">Every day you wait is a day of benefits you're missing out on.</p>
        <Link to="/signup" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Begin My Journey — Free
        </Link>
      </div>
    </div>
  );
}
