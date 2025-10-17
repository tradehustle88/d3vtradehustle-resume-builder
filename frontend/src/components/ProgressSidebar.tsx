"use client";

interface ProgressSidebarProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Select Trade", icon: "🔧" },
  { number: 2, title: "Your Info", icon: "👤" },
  { number: 3, title: "Certifications", icon: "📜" },
  { number: 4, title: "Generate", icon: "✨" },
  { number: 5, title: "Download", icon: "📥" },
];

export default function ProgressSidebar({ currentStep }: ProgressSidebarProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 brick-block sticky top-8">
      <h3 className="text-lg font-bold text-hustle-gold mb-6">Your Progress</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-12 w-0.5 h-8 transition-colors duration-300 ${
                    isCompleted ? "bg-hustle-gold" : "bg-gray-600"
                  }`}
                />
              )}

              {/* Step Item */}
              <div className="flex items-start gap-4">
                {/* Circle */}
                <div
                  className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg
                  transition-all duration-300 relative z-10
                  ${
                    isActive
                      ? "bg-hustle-gold text-hustle-navy ring-4 ring-hustle-gold/30"
                      : isCompleted
                      ? "bg-hustle-gold text-hustle-navy"
                      : "bg-gray-700 text-gray-400"
                  }
                `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 pt-1">
                  <p
                    className={`
                    text-sm font-medium transition-colors duration-300
                    ${isActive ? "text-hustle-gold" : isCompleted ? "text-white" : "text-gray-400"}
                  `}
                  >
                    Step {step.number}
                  </p>
                  <p
                    className={`
                    text-base font-semibold transition-colors duration-300
                    ${isActive ? "text-white" : isCompleted ? "text-gray-200" : "text-gray-500"}
                  `}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-hustle-gold to-yellow-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
