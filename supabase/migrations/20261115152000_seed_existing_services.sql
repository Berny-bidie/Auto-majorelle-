-- Publish only the factual service descriptions already used by the existing site.
insert into public.services (slug, name, description, icon, cta_label, cta_url, display_order, active, published)
values
  ('decouvrir-un-vehicule', 'Découvrir un véhicule', 'Consultez les annonces publiées, demandez les caractéristiques manquantes et convenez d’une visite au showroom pour examiner le véhicule.', 'car-front', 'Voir les véhicules', '/vehicules', 1, true, true),
  ('parler-de-financement', 'Parler de financement', 'Décrivez votre projet à notre équipe. Un taux, une durée et une offre définitive doivent être confirmés par l’organisme concerné.', 'handshake', 'Étudier mon projet', '/financement', 2, true, true),
  ('envisager-une-reprise', 'Envisager une reprise', 'Fournissez les informations de votre voiture et des photos. L’équipe pourra étudier votre demande; aucune estimation automatique n’est produite.', 'search', 'Demander une étude', '/reprise', 3, true, true)
on conflict (slug) do nothing;
