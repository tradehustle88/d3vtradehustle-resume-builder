import SocialCoin from './SocialCoin';

export default function SocialBar() {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 py-6">
      <SocialCoin 
        href="https://www.linkedin.com/company/tradehustle" 
        iconSrc="/icons/linkedin.png" 
        alt="LinkedIn" 
      />
      <SocialCoin 
        href="https://www.instagram.com/tradehustle" 
        iconSrc="/icons/instagram.png" 
        alt="Instagram" 
      />
      <SocialCoin 
        href="https://www.tiktok.com/@tradehustle" 
        iconSrc="/icons/tiktok.png" 
        alt="TikTok" 
      />
      <SocialCoin 
        href="https://www.facebook.com/tradehustle" 
        iconSrc="/icons/facebook.png" 
        alt="Facebook" 
      />
      <SocialCoin 
        href="https://www.indeed.com/cmp/tradehustle" 
        iconSrc="/icons/indeed.png" 
        alt="Indeed" 
      />
      <SocialCoin 
        href="https://www.pinterest.com/tradehustle" 
        iconSrc="/icons/pinterest.png" 
        alt="Pinterest" 
      />
    </div>
  );
}
