import Image from "next/image";

export default function HeroLogo() {
  return (
    <Image
      src="/assets/trade-hustle-logo-new.png"
      alt="Trade Hustle Resume Builder Logo"
      width={220}
      height={220}
      className="logo-animate"
    />
  );
}
