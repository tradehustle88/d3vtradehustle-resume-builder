import SocialCoin from './SocialCoin';

export default function SocialBar() {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 py-6">
      <SocialCoin 
        href="https://www.linkedin.com/company/nexxgennhustle" 
        iconSrc="/icons/linkedin.svg" 
        alt="LinkedIn" 
      />
      <SocialCoin 
        href="https://www.indeed.com/cmp/nexxgennhustle" 
        iconSrc="/icons/indeed.svg" 
        alt="Indeed" 
      />
      <SocialCoin 
        href="https://www.tiktok.com/@nexxgennhustle" 
        iconSrc="/icons/tiktok.svg" 
        alt="TikTok" 
      />
      <SocialCoin 
        href="https://www.instagram.com/nexxgennhustle" 
        iconSrc="/icons/instagram.svg" 
        alt="Instagram" 
      />
      <SocialCoin 
        href="https://www.pinterest.com/NeXxGeNnhustle" 
        iconSrc="/icons/pinterest.svg" 
        alt="Pinterest" 
      />
    </div>
  );
}