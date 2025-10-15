export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/assets/resumeBuilderLogo-v3.png" 
          alt="Trade Hustle" 
          className="w-80 h-80 mx-auto mb-8"
        />
        <h1 className="text-6xl font-bold text-white mb-4">
          <span className="text-amber-400">Trade Hustle</span>
          <br />
          Resume Builder
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Premium resumes for elite tradespeople
        </p>
        <button className="px-12 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-xl font-bold rounded-xl hover:scale-105 transition-all">
          Get Started Free
        </button>
      </div>
    </div>
  );
}
