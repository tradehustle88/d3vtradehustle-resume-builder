import Image from "next/image";

interface BrickWallHeroProps {
  children?: React.ReactNode;
  className?: string;
}

export default function BrickWallHero({ children, className = "" }: BrickWallHeroProps) {
  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Brick Wall Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/rickwall-background.webp"
          alt="Brick Wall Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            // Fallback to gradient if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)';
            }
          }}
        />
        
        {/* Fallback gradient background (shown if image fails to load) */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-700"
          style={{ zIndex: -1 }}
        />
      </div>

      {/* Paint Splatter Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Paint splatter elements using existing SVGs */}
        <div className="absolute top-10 left-20 opacity-30">
          <Image
            src="/textures/paint-splatter-1.svg"
            alt=""
            width={120}
            height={120}
            className="transform rotate-12"
            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
          />
        </div>
        
        <div className="absolute bottom-32 right-16 opacity-25">
          <Image
            src="/textures/paint-splatter-2.svg"
            alt=""
            width={80}
            height={80}
            className="transform -rotate-6"
            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
          />
        </div>
        
        <div className="absolute top-1/2 left-1/4 opacity-20">
          <Image
            src="/textures/paint-splatter-3.svg"
            alt=""
            width={100}
            height={100}
            className="transform rotate-45"
            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
          />
        </div>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}