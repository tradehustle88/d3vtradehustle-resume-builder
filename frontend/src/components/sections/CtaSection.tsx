"use client";

import Link from "next/link";

const actionLinks = [
  {
    href: "/wizard",
    label: "Launch the Wizard",
    description: "Guided build flow with AI suggestions.",
  },
  {
    href: "/trade-selection",
    label: "Explore Trade Playbooks",
    description: "See tailored starter templates for your trade.",
  },
  {
    href: "/pricing",
    label: "Compare Plans",
    description: "Unlock pro automations and insider job leads.",
  },
];

export default function CtaSection() {
  return (
    <section
      id="cta"
      className="border-t border-hustleBlue/10 bg-gradient-to-b from-white to-blue-50/30 py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutralText sm:text-4xl">
            Ready to stack your next opportunity?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Jump in wherever you are—start with a guided wizard, pull up
            trade-specific playbooks, or compare plans to unlock pro
            automations.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {actionLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-hustleBlue/15 bg-white p-6 transition hover:border-hustleRed hover:shadow-[0_8px_24px_rgba(229,9,20,0.15)]"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-hustleRed">
                {item.label}
              </p>
              <p className="mt-3 text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
