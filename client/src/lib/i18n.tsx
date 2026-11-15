import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Locale } from "@/locales/translations";

const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null);
const textOriginals = new WeakMap<Node, string>();
const textRendered = new WeakMap<Node, string>();
const attributeOriginals = new WeakMap<Element, Map<string, { source: string; rendered: string }>>();
const localizedAttributes = ["alt", "title", "aria-label", "aria-description", "placeholder", "content"];

function normalize(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const normalizedTranslations = {
  fr: new Map(Object.entries(translations.fr).map(([key, value]) => [normalize(key), value])),
  en: new Map(Object.entries(translations.en).map(([key, value]) => [normalize(key), value])),
  ar: new Map(Object.entries(translations.ar).map(([key, value]) => [normalize(key), value])),
};

export function translateText(source: string, locale: Locale): string {
  if (locale === "fr") return source;
  const clean = normalize(source);
  const dictionary = translations[locale];
  const direct = normalizedTranslations[locale].get(clean);
  if (direct !== undefined) return direct;

  for (const [key, value] of Object.entries(dictionary)) {
    const names: string[] = [];
    const pieces = normalize(key).split(/(\{\{\s*[^}]+?\s*\}\}|\{\s*[^}]+?\s*\})/g);
    const pattern = pieces.map(piece => {
      const match = piece.match(/^\{\{?\s*([^}]+?)\s*\}?\}$/);
      if (match) {
        names.push(match[1]);
        return "(.+?)";
      }
      return escapeRegExp(piece);
    }).join("");
    if (!names.length) continue;
    const match = clean.match(new RegExp(`^${pattern}$`));
    if (!match) continue;
    let translated = value;
    names.forEach((name, index) => {
      const token = new RegExp(`\\{\\{?\\s*${escapeRegExp(name)}\\s*\\}?`, "g");
      translated = translated.replace(token, match[index + 1] ?? "");
    });
    return translated;
  }
  return source;
}

function localizeTextNode(node: Node, locale: Locale) {
  const current = node.nodeValue;
  if (current === null || !current.trim()) return;
  const parent = node.parentElement;
  if (!parent || parent.closest("script, style, noscript, textarea, [data-i18n-ignore]")) return;
  const lastRendered = textRendered.get(node);
  let source = textOriginals.get(node);
  if (source === undefined || (lastRendered !== undefined && current !== lastRendered)) {
    source = current;
    textOriginals.set(node, source);
  }
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  const end = source.length - trailing.length;
  const core = source.slice(leading.length, end);
  const translated = `${leading}${translateText(core, locale)}${trailing}`;
  textRendered.set(node, translated);
  if (translated !== current) node.nodeValue = translated;
}

function localizeAttributes(element: Element, locale: Locale) {
  let values = attributeOriginals.get(element);
  if (!values) {
    values = new Map();
    attributeOriginals.set(element, values);
  }
  for (const attribute of localizedAttributes) {
    const current = element.getAttribute(attribute);
    if (current === null || !current.trim()) continue;
    const stored = values.get(attribute);
    const source = !stored || current !== stored.rendered ? current : stored.source;
    const translated = translateText(source, locale);
    values.set(attribute, { source, rendered: translated });
    if (translated !== current) element.setAttribute(attribute, translated);
  }
}

function localizeSubtree(root: Node, locale: Locale) {
  if (root.nodeType === Node.TEXT_NODE) {
    localizeTextNode(root, locale);
    return;
  }
  if (root.nodeType === Node.ELEMENT_NODE) localizeAttributes(root as Element, locale);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) localizeTextNode(node, locale);
    else if (node.nodeType === Node.ELEMENT_NODE) localizeAttributes(node as Element, locale);
  }
}

function TranslationObserver({ locale }: { locale: Locale }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    html.dataset.locale = locale;

    const roots = [document.head, document.body];
    roots.forEach(root => localizeSubtree(root, locale));
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") {
          localizeTextNode(record.target, locale);
        } else if (record.type === "attributes" && record.target instanceof Element) {
          localizeAttributes(record.target, locale);
        } else {
          for (const node of Array.from(record.addedNodes)) localizeSubtree(node, locale);
        }
      }
    });
    for (const root of roots) observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: localizedAttributes,
    });
    return () => observer.disconnect();
  }, [locale]);
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "fr";
    const saved = window.localStorage.getItem("automajorel-locale");
    return saved === "en" || saved === "ar" ? saved : "fr";
  });
  const setLocale = (next: Locale) => {
    window.localStorage.setItem("automajorel-locale", next);
    setLocaleState(next);
  };
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LanguageContext.Provider value={value}>
    <TranslationObserver locale={locale} />
    {children}
  </LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const label = locale === "ar" ? "اختر اللغة" : locale === "en" ? "Choose language" : "Choisir la langue";
  return <div className="language-switcher" aria-label={label} role="group" dir="ltr">
    {(["fr", "en", "ar"] as const).map(code => <button
      key={code}
      type="button"
      className={`language-option${locale === code ? " is-active" : ""}`}
      aria-pressed={locale === code}
      onClick={() => setLocale(code)}
    >{code === "ar" ? "العربية" : code.toUpperCase()}</button>)}
  </div>;
}
