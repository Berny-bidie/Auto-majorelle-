import { useLanguage } from "@/lib/i18n";
import { useSiteSettings } from "@/lib/siteSettings";

type SocialKind = "whatsapp" | "instagram" | "facebook" | "tiktok";
type SocialLinkItem = { kind: SocialKind; href: string; label: Record<"fr" | "en" | "ar", string> };

const links: SocialLinkItem[] = [
  { kind: "whatsapp", href: "https://wa.me/212678880268?text=Bonjour%20Auto%20Majorelle%2C%20je%20souhaite%20en%20savoir%20plus.", label: { fr: "WhatsApp Auto Majorelle", en: "Auto Majorelle on WhatsApp", ar: "واتساب أوتو ماجوريل" } },
  { kind: "instagram", href: "https://www.instagram.com/auto_majorelle/", label: { fr: "Instagram Auto Majorelle", en: "Auto Majorelle on Instagram", ar: "إنستغرام أوتو ماجوريل" } },
  { kind: "facebook", href: "https://www.facebook.com/automajorelle", label: { fr: "Facebook Auto Majorelle", en: "Auto Majorelle on Facebook", ar: "فيسبوك أوتو ماجوريل" } },
  { kind: "tiktok", href: "https://www.tiktok.com/@auto_majorelle", label: { fr: "TikTok Auto Majorelle", en: "Auto Majorelle on TikTok", ar: "تيك توك أوتو ماجوريل" } },
];

export function SocialGlyph({ kind }: { kind: SocialKind }) {
  if (kind === "whatsapp") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2A9.94 9.94 0 0 0 3.5 17.04L2.1 22l5.08-1.33A10 10 0 1 0 12.04 2Zm0 18.17a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.02.79.81-2.94-.2-.31a8.13 8.13 0 1 1 6.84 3.77Zm4.46-6.08c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.55.12-.16.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.31-.75-1.8-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.42.06-.64.3-.22.24-.83.81-.83 1.98 0 1.17.85 2.3.97 2.46.12.16 1.67 2.55 4.05 3.58.57.25 1.01.4 1.35.51.57.18 1.08.15 1.49.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>;
  if (kind === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.6 2h8.8A5.6 5.6 0 0 1 22 7.6v8.8a5.6 5.6 0 0 1-5.6 5.6H7.6A5.6 5.6 0 0 1 2 16.4V7.6A5.6 5.6 0 0 1 7.6 2Zm0 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm4.4 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.2-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" /></svg>;
  if (kind === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.6 22v-8.9h3l.45-3.48H13.6V7.4c0-1 .28-1.68 1.72-1.68h1.84V2.6c-.32-.04-1.42-.14-2.7-.14-2.67 0-4.5 1.63-4.5 4.62v2.54H6.94v3.48h3.02V22h3.64Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.6 7.7a6.4 6.4 0 0 1-3.83-1.27v8.06a6.07 6.07 0 1 1-5.24-6.01v3.38a2.71 2.71 0 1 0 1.88 2.58V2h3.36c.02.28.04.56.1.84a6.4 6.4 0 0 0 3.73 4.19v.67Z" /></svg>;
}

export function WhatsAppMark() {
  return <SocialGlyph kind="whatsapp" />;
}

export default function SocialLinks({ className = "" }: { className?: string }) {
  const { locale } = useLanguage();
  const contact = useSiteSettings();
  const messages = {
    fr: "Bonjour Auto Majorelle, je souhaite en savoir plus.",
    en: "Hello Auto Majorelle, I would like to know more.",
    ar: "مرحبًا Auto Majorelle، أود معرفة المزيد.",
  };
  return <div className={`footer-social social-links ${className}`}>
    {links.map(item => {
      const href = item.kind === "whatsapp" ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(messages[locale])}` : item.href;
      return <a key={item.kind} href={href} aria-label={item.label[locale]} title={item.label[locale]} target="_blank" rel="noopener noreferrer">
        <SocialGlyph kind={item.kind} /><span>{item.label[locale]}</span>
      </a>;
    })}
  </div>;
}
