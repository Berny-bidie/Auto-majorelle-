import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import PageMeta from "@/components/site/PageMeta";

export default function NotFound() {
  const [location] = useLocation();
  useEffect(() => {
    if (location !== "/404" && typeof window !== "undefined") window.location.replace("/404");
  }, [location]);
  return <>
    <PageMeta title="Page introuvable — Auto Majorelle" description="Cette page Auto Majorelle n’existe pas ou n’est plus disponible." noindex />
    <section className="not-found"><div><span className="eyebrow">ERREUR 404</span><h1>Cette page n’est plus ici.</h1><p>Le lien recherché a peut-être changé. Retrouvez les véhicules disponibles ou revenez à l’accueil Auto Majorelle.</p><Link className="button button-dark" href="/">Retour à l’accueil</Link></div></section>
  </>;
}
