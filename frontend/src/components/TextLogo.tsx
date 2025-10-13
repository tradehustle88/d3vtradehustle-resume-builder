'use client';

interface TextLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function TextLogo({ size = 'medium', className = '' }: TextLogoProps) {
  const sizeClasses = {
    small: 'text-2xl w-32 h-32',
    medium: 'text-4xl w-48 h-48', 
    large: 'text-6xl w-64 h-64'
  };

  return (
    <div className={`${sizeClasses[size]} flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-red-500 to-red-600 rounded-full border-4 border-yellow-400 shadow-2xl ${className}`}>
      <div className="text-center">
        <div className="font-heading font-black text-white uppercase leading-tight">
          TRADE
        </div>
        <div className="font-heading font-black text-black uppercase leading-tight -mt-1">
          HUSTLE
        </div>
        <div className="text-xs font-body text-white/90 uppercase tracking-wider mt-1">
          Resume Builder
        </div>
      </div>
    </div>
  );
}