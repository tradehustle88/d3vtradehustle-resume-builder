import Image from "next/image";

export default function HeroLogo() {
  return (
    <Image
      src="/assets/resumeBuilderLogo-v3.webp"
      alt="Trade Hustle Resume Builder - Professional Resume Templates for Skilled Trades"
      width={220}
      height={220}
      className="logo-animate"
      priority
      quality={85}
      sizes="(max-width: 768px) 160px, 220px"
    />
  );
}
