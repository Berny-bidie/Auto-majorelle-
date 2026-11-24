import { type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { Link, useParams } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { PageIntro, SectionHeading } from "@/components/site/Shared";
import { getFallbackBlogArticle, getLocalizedFallbackBlogArticles } from "@/data/fallbackEditorialContent";
import { useLanguage } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import NotFound from "./NotFound";

const localeTags = { fr: "fr-FR", en: "en-GB", ar: "ar-MA" } as const;
function formatDate(value: Date | null, locale: "fr" | "en" | "ar") {
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  return new Date(value).toLocaleDateString(localeTags[locale], { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPage() {
  const { locale } = useLanguage();
  const posts = trpc.automajorel.blog.list.useQuery();
  const hasPublishedPosts = Boolean(posts.data?.length);
  const articles = hasPublishedPosts ? posts.data! : getLocalizedFallbackBlogArticles(locale);
  return <>
    <PageMeta title="Conseils auto à Marrakech — Blog automajorelle" description="Conseils automobiles, guides d’achat et actualités publiés par automajorelle à Marrakech." />
    <PageIntro eyebrow="BLOG & CONSEILS" title="L’essentiel pour mieux choisir." intro="Nos articles partagent des repères utiles pour préparer votre projet automobile à Marrakech." />
    <section className="page-content"><div className="container">
      {!hasPublishedPosts && !posts.isLoading && <p className="notice notice-info" role="status">{locale === "en" ? "Practical guides are available here; articles published and managed in the admin area will appear when ready." : locale === "ar" ? "الأدلة العملية متاحة هنا؛ وستظهر المقالات المنشورة والمدارة من لوحة الإدارة عند توفرها." : "Les conseils pratiques restent consultables; les articles publiés et gérés depuis l’administration apparaîtront ici dès qu’ils seront disponibles."}</p>}
      <div className="article-grid">{articles.map(post => <Link className="article-card" href={`/blog/${post.slug}`} key={post.id}>
        {post.imageUrl ? <img className="article-card-image" src={post.imageUrl} alt={post.title} loading="lazy" /> : <div className="article-card-image article-card-placeholder"><BookOpen size={28} /></div>}
        <div className="article-card-body"><div className="article-card-meta"><span>{post.category}</span><span><Clock3 size={12} /> {post.readingMinutes} min</span></div><h2>{post.title}</h2><p>{post.excerpt}</p><span className="link-arrow">{locale === "ar" ? "اقرأ المقال" : locale === "en" ? "Read article" : "Lire l’article"} <ArrowRight size={14} /></span></div>
      </Link>)}</div>
    </div></section>
  </>;
}

export function BlogArticlePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { locale } = useLanguage();
  const post = trpc.automajorel.blog.bySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const article = post.data ?? getFallbackBlogArticle(slug, locale);
  if (post.isLoading && !article) return <><PageMeta title="Article — automajorelle" description="Chargement de l’article." /><div className="container page-content"><div className="skeleton" /></div></>;
  if (!article) return <NotFound />;
  const articleDate = formatDate(article.publishedAt, locale);
  return <>
    <PageMeta title={`${article.title} — Blog automajorelle`} description={article.excerpt} type="article" image={article.imageUrl || undefined} />
    <section className="page-content"><div className="container article-body"><Link className="link-arrow" href="/blog"><ArrowLeft size={15} /> {locale === "ar" ? "العودة إلى المدونة" : locale === "en" ? "Back to the blog" : "Retour au blog"}</Link><div style={{ height: 25 }} />{article.imageUrl && <img className="article-cover" src={article.imageUrl} alt={article.title} />}<span className="eyebrow">{article.category}</span><h1>{article.title}</h1><p className="article-source-note">{articleDate && <>{articleDate} · </>}{article.readingMinutes} {locale === "ar" ? "دقائق للقراءة" : locale === "en" ? "min read" : "min de lecture"}</p><Markdown body={article.body} /><div style={{ marginTop: 42 }}><Link className="button button-red" href="/contact">{locale === "ar" ? "تواصل مع automajorelle" : locale === "en" ? "Talk to automajorelle" : "Échanger avec automajorelle"} <ArrowRight size={15} /></Link></div></div></section>
    <section className="section section-surface"><div className="container"><SectionHeading eyebrow={locale === "ar" ? "للمزيد" : locale === "en" ? "MORE INFORMATION" : "POUR ALLER PLUS LOIN"} title={locale === "ar" ? "هل لديك مشروع سيارة؟" : locale === "en" ? "Planning a car purchase?" : "Un projet automobile ?"} description={locale === "ar" ? "تواصل مع فريق automajorelle للحصول على معلومات تناسب وضعك." : locale === "en" ? "Contact the automajorelle team for information specific to your situation." : "Contactez l’équipe automajorelle pour des informations propres à votre situation."} /><Link className="button button-dark" href="/vehicules">{locale === "ar" ? "عرض السيارات" : locale === "en" ? "View vehicles" : "Voir les véhicules"}</Link></div></section>
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
