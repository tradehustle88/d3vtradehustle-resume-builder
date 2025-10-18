import Image from "next/image";
import Link from "next/link";

const stackedPowerBadges = [
  { label: "Enhanced Intelligence Active", emphasis: true },
  { label: "ATS Certified", emphasis: false },
];

export default function StackedPowerHero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[100vh] px-6 py-16 overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #031B3E, #0C2C62, #F8FAFF 130%)'
    }}>
      {/* Logo centered under heading */}
      <div className="mb-8">
        <Image
          src="/assets/resumeBuilderLogo-v3.webp"
          alt="Trade Hustle Resume Builder - Professional Skilled Trade Resumes"
          width={120}
          height={120}
          priority
          quality={85}
          className="mx-auto drop-shadow-lg"
          sizes="(max-width: 768px) 80px, 120px"
        />
      </div>

      <header className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white tracking-tight" style={{ fontFamily: 'Anton, sans-serif' }}>
          TRADE HUSTLE RESUME BUILDER
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-[#D4A017] mb-4">
          Built by Hustle. Backed by Results.
        </p>
        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
          Recruiter-tested templates powered by Enhanced Intelligence to fix your resume in 5 minutes.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-12 mt-10">
        <Link
          href="/builder"
          className="flex-1 py-4 px-8 bg-[#E50914] text-white rounded-lg text-lg font-bold transition-all hover:bg-[#FF1B2D] shadow-lg hover:shadow-xl hover:scale-105"
        >
          Build My Resume
        </Link>
        <Link
          href="/ai-demo"
          className="flex-1 py-4 px-8 border-2 border-white/80 rounded-lg text-lg font-bold text-white hover:bg-white/10 hover:border-white transition-all"
        >
          Watch Demo
        </Link>
      </div>

      <ul className="flex flex-wrap justify-center gap-3 text-sm">
        {stackedPowerBadges.map((badge) => (
          <li
            key={badge.label}
            className={`px-4 py-2 rounded-full font-semibold ${
              badge.emphasis
                ? "bg-[#D4A017] text-white shadow-lg"
                : "bg-white/20 text-white backdrop-blur-sm"
            }`}
          >
            {badge.label}
          </li>
        ))}
      </ul>

    </section>
  );
}
