import Image from "next/image";
import Link from "next/link";

const stackedPowerBadges = [
  { label: "Enhanced Intelligence Active", emphasis: true },
  { label: "ATS Certified", emphasis: false },
];

export default function StackedPowerHero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[100vh] px-5 py-12 bg-gradient-to-b from-[#0A0A0A] to-[#101820] text-white overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(circle_at_bottom,_rgba(212,160,23,0.12),_rgba(10,10,10,0)_65%)] pointer-events-none" />

      <header>
        <h1 className="text-4xl font-anton leading-tight mb-2 md:text-5xl">
          Built for the Trade.
        </h1>
        <p className="text-base text-gray-300 mb-6 md:text-lg">
          Trusted by{" "}
          <span className="text-hustleYellow font-bold drop-shadow-[0_0_12px_rgba(212,160,23,0.35)]">
            31K+
          </span>{" "}
          resumes.
        </p>
      </header>

      <div className="flex flex-col gap-3 w-full max-w-xs mb-8">
        <Link
          href="/builder"
          className="w-full py-4 bg-hustleRed text-white rounded-xl text-lg font-semibold transition-transform active:scale-95 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
        >
          Build My Resume
        </Link>
        <Link
          href="/ai-demo"
          className="w-full py-4 border border-gray-600 rounded-xl text-lg font-semibold text-gray-200 active:scale-95 hover:border-hustleYellow transition-all"
        >
          Watch Demo
        </Link>
      </div>

      <figure className="relative w-[90%] max-w-[340px] mb-10 md:max-w-[420px]">
        <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(22,115,255,0.5)] animate-stacked-float ring-1 ring-white/10">
          <Image
            src="/assets/resume-preview.png"
            alt="Trade Hustle Resume Preview"
            fill
            priority
            className="object-cover opacity-90"
          />
        </div>
      </figure>

      <ul className="flex flex-wrap justify-center gap-2 text-[11px] text-gray-400">
        {stackedPowerBadges.map((badge) => (
          <li
            key={badge.label}
            className={`px-3 py-1 rounded-full ${
              badge.emphasis
                ? "bg-hustleYellow/80 text-black animate-pulse"
                : "bg-gray-800"
            }`}
          >
            {badge.label}
          </li>
        ))}
      </ul>

      <style jsx global>{`
        @keyframes stacked-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-stacked-float {
          animation: stacked-float 5s ease-in-out infinite;
        }

        .text-hustleRed {
          color: #e50914;
        }

        .text-hustleYellow {
          color: #d4a017;
        }

        .bg-hustleRed {
          background-color: #e50914;
        }

        .bg-hustleYellow {
          background-color: #d4a017;
        }
      `}</style>
    </section>
  );
}
