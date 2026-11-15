import { trpc } from "@/lib/trpc";
import { Notice } from "@/components/site/Shared";

const labels = [
  ["vehiclesTotal", "Véhicules enregistrés"],
  ["vehiclesPublished", "Annonces publiques"],
  ["newLeads", "Demandes à traiter"],
  ["leadsTotal", "Demandes reçues"],
  ["postsDraft", "Articles en brouillon"],
  ["postsPublished", "Articles publiés"],
] as const;

export default function DashboardStats() {
  const query = trpc.automajorel.admin.stats.useQuery();
  return <section aria-labelledby="admin-stats-title"><div className="admin-title-row"><div><span className="eyebrow">ACTIVITÉ DU SITE</span><h2 id="admin-stats-title">Vue d’ensemble</h2></div><button className="button button-outline button-small" onClick={() => void query.refetch()}>Actualiser</button></div>{query.error && <Notice kind="error">Impossible de charger les statistiques.</Notice>}{query.isLoading ? <div className="skeleton" /> : query.data && <div className="admin-stats-grid">{labels.map(([key, label]) => <article className="admin-stat-card" key={key}><span>{label}</span><strong>{query.data[key]}</strong></article>)}</div>}<div className="admin-card"><h3>À retenir</h3><p>Seuls les véhicules marqués « Publié » et « Disponible », les services publiés, les partenaires confirmés et les articles publiés sont visibles par les visiteurs.</p></div></section>;
}
