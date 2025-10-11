import Image from "next/image";

export default function HeroLogo() {
  return (
    <Image
      src="/resumeBuilderlogo.png"
      alt="Trade Hustle Resume Builder Logo"
      width={220}
      height={220}
      className="logo-animate"
    />
  );
}
