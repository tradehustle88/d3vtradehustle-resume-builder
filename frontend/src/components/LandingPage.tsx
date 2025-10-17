'use client'

import { useState } from 'react'
import Link from 'next/link'
import TopNavBar from './TopNavBar'
import CompleteHeroSystem from './CompleteHeroSystem'
import TradeSelectionGrid from './TradeSelectionGrid'
import ResumeVerifierSection from './ResumeVerifierSection'

const proofStats = [
  { label: 'Trades Backed', value: '42+', description: 'Skilled trades represented across the platform.' },
  { label: 'Hires Accelerated', value: '3x', description: 'Average speed increase from profile to interview.' },
  { label: 'AI Optimized', value: '100%', description: 'Every resume tuned for ATS + hiring manager review.' },
]

const visualHighlights = [
  { title: 'Blueprint Builder', detail: 'Drag-and-drop layout tuned for quick edits on any device.' },
  { title: 'Skill Heatmaps', detail: 'Auto-highlight the certifications and licenses that drive callbacks.' },
  { title: 'One-Click Exports', detail: 'Share-ready PDF, DOCX, and portfolio links generated instantly.' },
]

const actionLinks = [
  { href: '/wizard', label: 'Launch the Wizard', description: 'Guided build flow with AI suggestions.' },
  { href: '/trade-selection', label: 'Explore Trade Playbooks', description: 'See tailored starter templates for your trade.' },
  { href: '/pricing', label: 'Compare Plans', description: 'Unlock pro automations and insider job leads.' },
]

export default function LandingPage() {
  const [showTradeSelection, setShowTradeSelection] = useState(false)

  return (
    <main className="min-h-screen bg-neutralBg text-neutralText">
      <TopNavBar />
      <CompleteHeroSystem />
      
      {/* ATS Verification Section */}
      <ResumeVerifierSection />

      <section id="proof" className="border-t border-hustleBlue/10 bg-gradient-to-b from-white via-neutralBg to-blue-50/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24 sm:px-10">
          <div className="flex flex-col gap-6 text-center sm:gap-8">
            <h2 className="text-3xl font-semibold tracking-tight text-neutralText sm:text-4xl">
              Proof from the field
            </h2>
            <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
              Trade Hustle builders are landing interviews faster with credential-forward resumes
              that showcase hustle, certifications, and project wins in seconds.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {proofStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-hustleBlue/15 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-hustleRed">{stat.label}</p>
                <p className="mt-3 text-4xl font-semibold text-neutralText">{stat.value}</p>
                <p className="mt-4 text-sm text-gray-600">{stat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="visual"
        className="border-t border-hustleBlue/10 bg-gradient-to-br from-blue-50/30 via-neutralBg to-white py-24"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutralText sm:text-4xl">
              Visual previews that sell your hustle
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Stack trade-tested templates, skill tags, and project proof so every employer sees why
              you&apos;re the standout hire. Toggle between pro looks that match union, residential,
              or commercial expectations in seconds.
            </p>
            <ul className="space-y-4">
              {visualHighlights.map((item) => (
                <li key={item.title} className="flex gap-4 rounded-2xl border border-hustleBlue/10 bg-white p-4 shadow-sm">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-hustleYellow" />
                  <div>
                    <p className="font-semibold text-neutralText">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowTradeSelection(true)}
                className="inline-flex items-center justify-center rounded-full bg-hustleRed px-6 py-3 text-sm font-semibold text-white transition hover:bg-hustleRed/90 shadow-[0_4px_12px_rgba(229,9,20,0.25)]"
              >
                Pick my trade playbook
              </button>
              <Link
                href="/templates"
                className="inline-flex items-center justify-center rounded-full border-2 border-hustleBlue/30 px-6 py-3 text-sm font-semibold text-neutralText transition hover:border-hustleBlue hover:bg-hustleBlue/5"
              >
                Browse template gallery
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl border border-hustleBlue/20 bg-gradient-to-tr from-white via-blue-50/50 to-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <div className="pointer-events-none absolute inset-0 animate-float bg-[radial-gradient(circle_at_top,_rgba(22,115,255,0.15),_transparent_65%)]" />
              <div className="relative mx-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-hustleBlue/20 bg-white p-6 text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <p className="text-xs uppercase tracking-[0.3em] text-hustleRed">Live preview</p>
                <p className="text-lg font-semibold text-neutralText">Certified HVAC Lead</p>
                <p className="text-sm text-gray-600">
                  Licenses, safety credentials, and project stats showcased automatically. Just swap
                  in your details.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• OSHA 30 • EPA 608 • Nadca Certified</p>
                  <p>• 37% faster callbacks across midsize commercial bids.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="border-t border-hustleBlue/10 bg-gradient-to-b from-white to-blue-50/30 py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutralText sm:text-4xl">
              Ready to stack your next opportunity?
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Jump in wherever you are—start with a guided wizard, pull up trade-specific playbooks,
              or compare plans to unlock pro automations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {actionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-hustleBlue/15 bg-white p-6 transition hover:border-hustleRed hover:shadow-[0_8px_24px_rgba(229,9,20,0.15)]"
              >
                <p className="text-sm uppercase tracking-[0.25em] text-hustleRed">{item.label}</p>
                <p className="mt-3 text-sm text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showTradeSelection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
            <div className="flex justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-hustleRed">Pick your trade</p>
              <button
                onClick={() => setShowTradeSelection(false)}
                className="rounded-full border-2 border-hustleBlue/30 px-4 py-2 text-sm font-semibold text-neutralText transition hover:border-hustleBlue hover:bg-hustleBlue/5"
              >
                Close
              </button>
            </div>
            <TradeSelectionGrid />
          </div>
        </div>
      )}
    </main>
  )
}
