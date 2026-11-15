import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

type HorizontalCarouselProps = {
  label: string;
  children: ReactNode;
  className?: string;
  autoPlay?: boolean;
};

export default function HorizontalCarousel({ label, children, className = "", autoPlay = false }: HorizontalCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { locale } = useLanguage();
  const previousLabel = locale === "ar" ? "العناصر السابقة" : locale === "en" ? "Previous items" : "Éléments précédents";
  const nextLabel = locale === "ar" ? "العناصر التالية" : locale === "en" ? "Next items" : "Éléments suivants";

  const move = (direction: -1 | 1) => {
    const element = track.current;
    if (!element) return;
    const firstCard = element.querySelector<HTMLElement>(".carousel-item");
    const gap = Number.parseFloat(getComputedStyle(element).columnGap || getComputedStyle(element).gap || "0") || 0;
    const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : element.clientWidth * 0.82;
    const edge = element.scrollWidth - element.clientWidth;
    const atEnd = element.scrollLeft >= edge - 4;
    const atStart = element.scrollLeft <= 4;
    if (direction === 1 && atEnd) element.scrollTo({ left: 0, behavior: "smooth" });
    else if (direction === -1 && atStart) element.scrollTo({ left: edge, behavior: "smooth" });
    else element.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoPlay || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => move(1), 5200);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused]);

  return <section className={`horizontal-carousel ${className}`} aria-label={label}>
    <div className="carousel-controls">
      <button type="button" className="carousel-control" aria-label={previousLabel} onClick={() => move(-1)}>
        <ArrowLeft size={16} aria-hidden="true" />
      </button>
      <button type="button" className="carousel-control" aria-label={nextLabel} onClick={() => move(1)}>
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
    <div
      ref={track}
      className="carousel-track"
      role="region"
      aria-roledescription={locale === "ar" ? "عرض متتابع" : locale === "en" ? "carousel" : "carrousel"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >{children}</div>
  </section>;
}
