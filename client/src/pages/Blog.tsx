import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { Link, useParams } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { PageIntro, SectionHeading } from "@/components/site/Shared";
import { getFallbackBlogArticle, getLocalizedFallbackBlogArticles } from "@/data/fallbackEditorialContent";
import { getBlogFallbackImage } from "@/data/blogImages";
import { localizedEditorial } from "@/data/localizedEditorial";
import { translateText, useLanguage } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import NotFound from "./NotFound";

const localeTags = { fr: "fr-FR", en: "en-GB", ar: "ar-MA" } as const;
function formatDate(value: Date | null, locale: "fr" | "en" | "ar") {
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  return new Date(value).toLocaleDateString(localeTags[locale], { year: "numeric", month: "long", day: "numeric" });
}

function localizePost(post: { title: string; category: string; excerpt: string; body: string }, locale: "fr" | "en" | "ar") {
  if (locale === "fr") return { ...post };
  const bodyLines = post.body.split(/\r?\n/);
  const values = [post.title, post.category, post.excerpt, ...bodyLines.filter(line => line.trim())];
  if (values.some(value => translateText(value, locale) === value)) return null;
  return {
    ...post,
    title: translateText(post.title, locale),
    category: translateText(post.category, locale),
    excerpt: translateText(post.excerpt, locale),
    body: bodyLines.map(line => line.trim() ? translateText(line, locale) : line).join("\n"),
  };
}

const copy = {
  fr: { eyebrow: "BLOG & CONSEILS", title: "L’essentiel pour mieux choisir.", intro: "Des repères pratiques pour préparer votre projet automobile à Marrakech.", editorial: "Guides Auto Majorelle", minutes: "min", read: "Lire l’article", published: "Articles publiés", empty: "Les articles publiés par l’équipe apparaîtront ici.", loading: "Chargement de l’article.", back: "Retour au blog", minutesRead: "min de lecture", contact: "Échanger avec Auto Majorelle", more: "POUR ALLER PLUS LOIN", moreTitle: "Un projet automobile ?", moreText: "Contactez l’équipe Auto Majorelle pour des informations propres à votre situation.", viewCars: "Voir les véhicules", all: "Tous les thèmes", featured: "À la une", categoryLabel: "Filtrer par thème" },
  en: { eyebrow: "BLOG & ADVICE", title: "A little guidance for a better choice.", intro: "Practical pointers to help you plan your automotive project in Marrakech.", editorial: "Auto Majorelle guides", minutes: "min", read: "Read article", published: "Published articles", empty: "Articles published by the team will appear here.", loading: "Loading article.", back: "Back to the blog", minutesRead: "min read", contact: "Talk to Auto Majorelle", more: "MORE INFORMATION", moreTitle: "Planning a car purchase?", moreText: "Contact the Auto Majorelle team for information specific to your situation.", viewCars: "View vehicles", all: "All topics", featured: "Featured", categoryLabel: "Filter by topic" },
  ar: { eyebrow: "المدونة والنصائح", title: "إرشادات تساعدك على الاختيار.", intro: "معلومات عملية لمساعدتك على التخطيط لمشروعك المتعلق بالسيارات في مراكش.", editorial: "أدلة أوتو ماجوريل", minutes: "دقائق", read: "اقرأ المقال", published: "مقالات منشورة", empty: "ستظهر هنا المقالات التي ينشرها الفريق.", loading: "جارٍ تحميل المقال.", back: "العودة إلى المدونة", minutesRead: "دقائق للقراءة", contact: "تواصل مع أوتو ماجوريل", more: "للمزيد من المعلومات", moreTitle: "هل تخطط لشراء سيارة؟", moreText: "تواصل مع فريق أوتو ماجوريل للحصول على معلومات تناسب وضعك.", viewCars: "عرض السيارات", all: "كل المواضيع", featured: "مختارات", categoryLabel: "تصفية حسب الموضوع" },
} as const;

export default function BlogPage() {
  const { locale } = useLanguage();
  const labels = copy[locale];
  const posts = trpc.automajorel.blog.list.useQuery();
  const publishedPosts = (posts.data ?? []).map(post => ({ post, localized: localizePost(post, locale) })).filter((entry): entry is { post: typeof entry.post; localized: NonNullable<typeof entry.localized> } => entry.localized !== null);
  const fallbackArticles = getLocalizedFallbackBlogArticles(locale);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const categoryOptions = useMemo(() => [...new Set(localizedEditorial.map(article => article.category[locale]))], [locale]);
  const visibleEditorial = localizedEditorial.filter(article => categoryFilter === "all" || article.category[locale] === categoryFilter);
  const featuredArticle = localizedEditorial[0];
  return <>
    <PageMeta title="Conseils auto à Marrakech — Blog Auto Majorelle" description="Conseils automobiles, guides d’achat et actualités publiés par Auto Majorelle à Marrakech." />
    <PageIntro eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} />
    <section className="page-content"><div className="container">
      <SectionHeading eyebrow={labels.editorial} title={labels.title} description={labels.intro} />
      {featuredArticle && <Link className="featured-article" href={`/blog/${featuredArticle.slug}`}>
        <img src={featuredArticle.imageUrl} alt={featuredArticle.title[locale]} width="960" height="560" loading="eager" fetchPriority="high" />
        <div className="featured-article-copy"><span className="eyebrow">{labels.featured}</span><h2>{featuredArticle.title[locale]}</h2><p>{featuredArticle.excerpt[locale]}</p><span className="link-arrow">{labels.read} <ArrowRight size={14} /></span></div>
      </Link>}
      <div className="blog-toolbar"><span className="eyebrow">{labels.categoryLabel}</span><div className="blog-filters" role="group" aria-label={labels.categoryLabel}><button type="button" className={categoryFilter === "all" ? "active" : ""} onClick={() => setCategoryFilter("all")}>{labels.all}</button>{categoryOptions.map(category => <button type="button" className={categoryFilter === category ? "active" : ""} key={category} onClick={() => setCategoryFilter(category)}>{category}</button>)}</div></div>
      <div className="article-grid">
        {visibleEditorial.map(article => {
          const image = getBlogFallbackImage(article.category.fr);
          return <Link className="article-card" href={`/blog/${article.slug}`} key={article.slug}>
            <img className="article-card-image" src={article.imageUrl} alt={image.alt[locale]} width={image.width} height={image.height} loading="lazy" decoding="async" />
            <div className="article-card-body"><div className="article-card-meta"><span>{article.category[locale]}</span><span><Clock3 size={12} /> {article.readingMinutes} {labels.minutes}</span></div><h2>{article.title[locale]}</h2><p>{article.excerpt[locale]}</p><span className="link-arrow">{labels.read} <ArrowRight size={14} /></span></div>
          </Link>;
        })}
        {fallbackArticles.filter(article => categoryFilter === "all" || article.category === categoryFilter).map(article => <Link className="article-card" href={`/blog/${article.slug}`} key={article.slug}>
          <img className="article-card-image" src={article.imageUrl} alt={article.title} loading="lazy" decoding="async" />
          <div className="article-card-body"><div className="article-card-meta"><span>{article.category}</span><span><Clock3 size={12} /> {article.readingMinutes} {labels.minutes}</span></div><h2>{article.title}</h2><p>{article.excerpt}</p><span className="link-arrow">{labels.read} <ArrowRight size={14} /></span></div>
        </Link>)}
      </div>
      <section aria-label={labels.published} style={{ marginTop: 76 }}><h2 className="eyebrow">{labels.published}</h2>
        {posts.isLoading ? <div className="skeleton" /> : posts.error ? <div className="notice notice-error">{locale === "ar" ? "تعذر تحميل المدونة حاليًا. يرجى المحاولة لاحقًا." : locale === "en" ? "The blog cannot be loaded right now. Please try again later." : "Le blog ne peut pas être chargé pour le moment. Réessayez plus tard."}</div> : publishedPosts.length ? <div className="article-grid">{publishedPosts.map(({ post, localized }) => {
          const fallbackImage = post.imageUrl ? undefined : getBlogFallbackImage(post.category);
          return <Link className="article-card" href={`/blog/${post.slug}`} key={post.id}>
            <img className="article-card-image" src={post.imageUrl || fallbackImage!.src} alt={post.imageUrl ? localized.title : fallbackImage!.alt[locale]} width={fallbackImage?.width} height={fallbackImage?.height} loading="lazy" decoding="async" />
            <div className="article-card-body"><div className="article-card-meta"><span>{localized.category}</span><span><Clock3 size={12} /> {post.readingMinutes} {labels.minutes}</span></div><h2>{localized.title}</h2><p>{localized.excerpt}</p><span className="link-arrow">{labels.read} <ArrowRight size={14} /></span></div>
          </Link>;
        })}</div> : <p>{labels.empty}</p>}
      </section>
    </div></section>
  </>;
}

export function BlogArticlePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { locale } = useLanguage();
  const labels = copy[locale];
  const editorial = localizedEditorial.find(article => article.slug === slug);
  const fallback = getFallbackBlogArticle(slug, locale);
  const post = trpc.automajorel.blog.bySlug.useQuery({ slug }, { enabled: Boolean(slug) && !editorial && !fallback });
  if (editorial) {
    const image = getBlogFallbackImage(editorial.category.fr);
    return <>
    <PageMeta title={`${editorial.title[locale]} — Auto Majorelle`} description={editorial.excerpt[locale]} type="article" image={editorial.imageUrl} />
    <section className="page-content"><div className="container article-body"><Link className="link-arrow" href="/blog"><ArrowLeft size={15} /> {labels.back}</Link><div style={{ height: 25 }} /><img className="article-cover" src={editorial.imageUrl} alt={image.alt[locale]} width={image.width} height={image.height} loading="eager" fetchPriority="high" decoding="async" /><span className="eyebrow">{editorial.category[locale]}</span><h1>{editorial.title[locale]}</h1><p className="article-source-note">Auto Majorelle · {editorial.readingMinutes} {labels.minutesRead}</p><div className="prose">{editorial.blocks.map((block, index) => <section key={index}>{block.heading && <h2>{block.heading[locale]}</h2>}{block.text[locale] && <p>{block.text[locale]}</p>}{block.bullets && <ul>{block.bullets.map(item => <li key={item[locale]}>{item[locale]}</li>)}</ul>}</section>)}</div><div style={{ marginTop: 42 }}><Link className="button button-red" href="/contact">{labels.contact} <ArrowRight size={15} /></Link></div></div></section>
    <section className="section section-surface"><div className="container"><SectionHeading eyebrow={labels.more} title={labels.moreTitle} description={labels.moreText} /><Link className="button button-dark" href="/vehicules">{labels.viewCars}</Link></div></section>
  </>;
  }
  if (fallback) return <>
    <PageMeta title={`${fallback.title} — Auto Majorelle`} description={fallback.excerpt} type="article" image={fallback.imageUrl} />
    <section className="page-content"><div className="container article-body"><Link className="link-arrow" href="/blog"><ArrowLeft size={15} /> {labels.back}</Link><div style={{ height: 25 }} /><img className="article-cover" src={fallback.imageUrl} alt={fallback.title} /><span className="eyebrow">{fallback.category}</span><h1>{fallback.title}</h1><p className="article-source-note">Auto Majorelle · {fallback.readingMinutes} {labels.minutesRead}</p><Markdown body={fallback.body} /><div style={{ marginTop: 42 }}><Link className="button button-red" href="/contact">{labels.contact} <ArrowRight size={15} /></Link></div></div></section>
    <section className="section section-surface"><div className="container"><SectionHeading eyebrow={labels.more} title={labels.moreTitle} description={labels.moreText} /><Link className="button button-dark" href="/vehicules">{labels.viewCars}</Link></div></section>
  </>;
  if (post.isLoading) return <><PageMeta title="Article — Auto Majorelle" description={labels.loading} /><div className="container page-content"><div className="skeleton" /></div></>;
  if (post.error || !post.data) return <NotFound />;
  const article = post.data;
  const localizedArticle = localizePost(article, locale);
  if (!localizedArticle) return <NotFound />;
  const fallbackImage = article.imageUrl ? undefined : getBlogFallbackImage(article.category);
  const articleImage = article.imageUrl || fallbackImage!.src;
  return <>
    <PageMeta title={`${localizedArticle.title} — Auto Majorelle`} description={localizedArticle.excerpt} type="article" image={articleImage} />
    <section className="page-content"><div className="container article-body"><Link className="link-arrow" href="/blog"><ArrowLeft size={15} /> {labels.back}</Link><div style={{ height: 25 }} /><img className="article-cover" src={articleImage} alt={article.imageUrl ? localizedArticle.title : fallbackImage!.alt[locale]} width={fallbackImage?.width} height={fallbackImage?.height} loading="eager" fetchPriority="high" decoding="async" /><span className="eyebrow">{localizedArticle.category}</span><h1>{localizedArticle.title}</h1><p className="article-source-note">{formatDate(article.publishedAt, locale)} · {article.readingMinutes} {labels.minutesRead}</p><Markdown body={localizedArticle.body} /><div style={{ marginTop: 42 }}><Link className="button button-red" href="/contact">{labels.contact} <ArrowRight size={15} /></Link></div></div></section>
    <section className="section section-surface"><div className="container"><SectionHeading eyebrow={labels.more} title={labels.moreTitle} description={labels.moreText} /><Link className="button button-dark" href="/vehicules">{labels.viewCars}</Link></div></section>
  </>;
}

function Markdown({ body }: { body: string }) {
  const lines = body.split(/\r?\n/); const content: ReactNode[] = []; let list: string[] = [];
  const flush = () => { if (list.length) { content.push(<ul key={`list-${content.length}`}>{list.map((item, index) => <li key={index}>{item}</li>)}</ul>); list = []; } };
  lines.forEach((line, index) => {
    const text = line.trim();
    if (!text) { flush(); return; }
    if (text.startsWith("- ")) { list.push(text.slice(2)); return; }
    flush();
    if (text.startsWith("### ")) content.push(<h3 key={index}>{text.slice(4)}</h3>);
    else if (text.startsWith("## ")) content.push(<h2 key={index}>{text.slice(3)}</h2>);
    else content.push(<p key={index}>{text.replaceAll("**", "")}</p>);
  });
  flush();
  return <div className="prose">{content}</div>;
}
