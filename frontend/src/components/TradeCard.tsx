"use client";

interface TradeCardProps {
  tradeKey: string;
  title: string;
  icon: string;
  certCount: number;
  selected: boolean;
  onSelect: () => void;
}

export default function TradeCard({
  tradeKey,
  title,
  icon,
  certCount,
  selected,
  onSelect,
}: TradeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-300 text-left
        ${
          selected
            ? "border-hustle-gold bg-hustle-gold/20 shadow-lg shadow-hustle-gold/50"
            : "border-hustle-gold/30 bg-white/5 hover:border-hustle-gold/60 hover:bg-white/10"
        }
      `}
    >
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

      {/* Cert Count */}
      <p className="text-sm text-gray-300">
        {certCount} required certifications
      </p>

      {/* Selected Badge */}
      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-hustle-gold rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-hustle-navy"
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
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-hustle-gold/0 to-hustle-gold/0 hover:from-hustle-gold/5 hover:to-hustle-gold/10 rounded-lg pointer-events-none transition-all duration-300" />
    </button>
  );
}
