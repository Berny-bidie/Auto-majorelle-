import { useEffect } from "react";

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
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "Auto Majorelle");
    if (image) setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (image) setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    document.querySelector('link[rel="canonical"]')?.remove();
  }, [title, description, image, noindex, type]);
  return null;
}
