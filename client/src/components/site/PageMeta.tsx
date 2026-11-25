import { useEffect } from "react";
import { translateText, useLanguage } from "@/lib/i18n";

type PageMetaProps = {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
};

function setMeta(selector: string, attr: string, key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

export default function PageMeta({ title, description, image, noindex = false, type = "website" }: PageMetaProps) {
  const { locale } = useLanguage();
  useEffect(() => {
    const localizedTitle = translateText(title, locale);
    const localizedDescription = translateText(description, locale);
    document.title = localizedTitle;
    setMeta('meta[name="description"]', "name", "description", localizedDescription);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    setMeta('meta[property="og:title"]', "property", "og:title", localizedTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", localizedDescription);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "automajorelle");
    if (image) setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", localizedTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", localizedDescription);
    if (image) setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    document.querySelector('link[rel="canonical"]')?.remove();
  }, [title, description, image, noindex, type, locale]);
  return null;
}
