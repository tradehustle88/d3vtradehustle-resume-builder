'use client';

import Image from 'next/image';
import Link from 'next/link';

type SocialCoinProps = {
  href: string;
  iconSrc: string;     // e.g. "/icons/linkedin.svg" (white mono)
  alt: string;
  size?: number;       // coin diameter (px)
};

export default function SocialCoin({ href, iconSrc, alt, size = 56 }: SocialCoinProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
      aria-label={alt}
    >
      <div
        className="relative inline-flex items-center justify-center rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.35)] before:absolute before:inset-0 before:rounded-full before:bg-black/20 after:pointer-events-none after:absolute after:inset-[2px] after:rounded-full after:shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.45),inset_0_-1.5px_2px_rgba(255,255,255,0.18)]"
        style={{
          width: size,
          height: size,
          // GOLD METAL gradient (coin face)
          background: `
            radial-gradient(120% 120% at 30% 25%, #FFF9C4 0%, #FFE066 15%, #E8C33A 32%, #C79B1B 55%, #9C7612 78%, #6B5010 100%),
            linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0) 40%),
            linear-gradient(20deg, rgba(255,255,255,0.20) 15%, rgba(255,255,255,0) 55%)
          `,
          // thin outer rim
          boxShadow: 'inset 0 0 0 1.25px rgba(255, 215, 90, 0.85)'
        }}
      >
        {/* glossy highlight arc */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-full"
          style={{
            background:
              'conic-gradient(from 200deg at 50% 50%, rgba(255,255,255,0.0) 0deg, rgba(255,255,255,0.55) 22deg, rgba(255,255,255,0.0) 65deg, rgba(0,0,0,0.08) 120deg, rgba(255,255,255,0.0) 360deg)'
          }}
        />
        {/* icon */}
        <Image
          src={iconSrc}
          alt={alt}
          width={Math.round(size * 0.5)}
          height={Math.round(size * 0.5)}
          className="relative z-10 opacity-95"
        />
      </div>
    </Link>
  );
}
