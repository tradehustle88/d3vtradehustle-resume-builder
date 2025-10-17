"use client";

import { getTradeDisplayInfo } from "@/lib/tradesData";
import type { TradePlaceholderMap, UserData } from "@/lib/tradesData";

interface ResumePreviewNewProps {
  placeholders: TradePlaceholderMap;
  userData: UserData;
  tradeKey: string;
}

export default function ResumePreviewNew({
  placeholders,
  userData,
  tradeKey,
}: ResumePreviewNewProps) {
  const tradeInfo = getTradeDisplayInfo(tradeKey);

  return (
    <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {userData.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {userData.email && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {userData.email}
            </span>
          )}
          {userData.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {userData.phone}
            </span>
          )}
          {userData.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {userData.location}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {placeholders.SUMMARY_SENTENCE_1} {placeholders.SUMMARY_SENTENCE_2}
        </p>
      </section>

      {/* Core Skills */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">
          Core Skills
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            placeholders.SKILL_1,
            placeholders.SKILL_2,
            placeholders.SKILL_3,
            placeholders.SKILL_4,
            placeholders.SKILL_5,
            placeholders.SKILL_6,
          ].map((skill, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-900 mt-1">•</span>
              <span className="text-gray-700">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">
          Certifications & Licenses
        </h2>
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <span className="text-gray-900 mt-1">•</span>
            <span className="text-gray-700">{placeholders.CERT_1}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-900 mt-1">•</span>
            <span className="text-gray-700">{placeholders.CERT_2}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-900 mt-1">•</span>
            <span className="text-gray-700">{placeholders.CERT_3}</span>
          </div>
          {userData.certifications &&
            userData.certifications.length > 0 &&
            userData.certifications.map((cert, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-900 mt-1">•</span>
                <span className="text-gray-700">{cert}</span>
              </div>
            ))}
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">
          Professional Experience
        </h2>
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {placeholders.EXPERIENCE_TITLE_1}
              </h3>
              <p className="text-gray-600">
                {placeholders.EXPERIENCE_COMPANY_1}
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {placeholders.EXPERIENCE_DATES_1}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>{placeholders.EXPERIENCE_BULLET_1}</li>
            <li>{placeholders.EXPERIENCE_BULLET_2}</li>
            <li>{placeholders.EXPERIENCE_BULLET_3}</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-300 text-center">
        <p className="text-xs text-gray-500">
          Generated by Trade Hustle Resume Builder • {tradeInfo.displayName} •{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
