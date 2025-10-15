import Image from "next/image";

export default function HeroLogo() {
  return (
    <Image
      src="/assets/resumeBuilderLogo-v3.png"
      alt="Trade Hustle Resume Builder"
      width={220}
      height={220}
      className="logo-animate"
    />
  );
}
