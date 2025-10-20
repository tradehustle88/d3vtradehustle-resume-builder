"use client";

const proofStats = [
  {
    label: "Trades Backed",
    value: "42+",
    description: "Skilled trades represented across the platform.",
  },
  {
    label: "Hires Accelerated",
    value: "3x",
    description:
      "Average speed increase from profile to interview.",
  },
  {
    label: "AI Optimized",
    value: "100%",
    description:
      "Every resume tuned for ATS + hiring manager review.",
  },
];

export default function ProofSection() {
  return (
    <section
      id="proof"
      className="border-t border-hustleBlue/10 bg-gradient-to-b from-white via-neutralBg to-blue-50/30"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24 sm:px-10">
        <div className="flex flex-col gap-6 text-center sm:gap-8">
          <h2 className="text-3xl font-semibold tracking-tight text-neutralText sm:text-4xl">
            Proof from the field
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
            Trade Hustle builders are landing interviews faster with
            credential-forward resumes that showcase hustle, certifications, and
            project wins in seconds.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {proofStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-hustleBlue/15 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-hustleRed">
                {stat.label}
              </p>
              <p className="mt-3 text-4xl font-semibold text-neutralText">
                {stat.value}
              </p>
              <p className="mt-4 text-sm text-gray-600">{stat.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
