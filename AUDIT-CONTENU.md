# Audit de contenu — Auto Majorelle

Site source fourni : [https://codesandboxlightcc03be5d1784675163.vercel.app/](https://codesandboxlightcc03be5d1784675163.vercel.app/).

## Contenus présents et intégrés au projet

Le projet contient déjà les pages d’accueil, catalogue, fiches véhicule, services, financement, reprise, garanties, blog, présentation et contact, ainsi qu’un espace d’administration. Le catalogue doit rester alimenté par des annonces réelles; les demandes de financement et de reprise utilisent les formulaires de l’application.

La page de financement reprend maintenant les informations principales affichées sur le site fourni : taux annoncé à partir de 7 % et durée de 12 à 72 mois. Le taux de 7 % est chargé comme valeur purement indicative dans le simulateur. La page inclut également la liste de pièces évoquées pour salariés, indépendants, sociétés et Marocains résidant à l’étranger, en précisant qu’elle doit être confirmée par l’organisme et que les documents personnels ne doivent être transmis qu’après vérification du canal.

Les pages de garanties et de reprise signalent explicitement les divergences du site source afin de ne pas transformer ses chiffres en engagements. La page d’accueil comprend la galerie d’images fixes extraites de la vidéo du showroom et le défilement horizontal de logos — Dacia, Toyota, Volkswagen, Range Rover, Audi, Mercedes-Benz, MINI, Porsche, SEAT et Kia. Les extraits vidéo ne sont pas présentés comme preuve de disponibilité actuelle.

## Blog et données commerciales à confirmer

Le site fourni présente au moins un article de blog sur l’achat d’une voiture d’occasion. Le projet contient six articles importés dans `client/src/data/sourceBlogArticles.ts`, dans les catégories achat, modèles, financement, choix d’un concessionnaire, reprise et SUV. Le texte inclut des affirmations chiffrées ou commerciales qui doivent être révisées avant publication; ces articles restent donc des brouillons. Confirmer avec l’équipe que les six articles correspondent bien à l’ensemble du contenu du site source.

Le site source annonce diverses statistiques commerciales : plus de 20 ans d’expérience, plus de 500 clients, une note de 4,8/5 avec plus de 200 avis et plus de 100 véhicules. Son texte SEO évoque aussi un stock de 50 véhicules. Ces chiffres n’ont pas été intégrés comme faits vérifiés.

Les pages de vente et de véhicules affichent simultanément un stock à 0 et des exemples manifestement de test (modèles ou valeurs incohérents, notamment « ZEGZE TYEZS », « Ferrari roll roys » et des entrées « TEST »). Ces entrées ne doivent pas être importées dans le catalogue. Le site annonce aussi une inspection en 200 points, tandis qu’un autre passage mentionne 150 points.

Le financement est annoncé à 7 % jusqu’à 72 mois, mais le délai de réponse varie entre 24 et 48 heures suivant les pages. La page de financement évoque des frais de dossier à 0 DH avec astérisque et six banques; la liste de partenaires citée ailleurs diffère. Le taux, le coût total, les frais, les établissements réellement partenaires, la durée et le délai d’étude doivent être confirmés par écrit avant toute publication comme offre ferme.

La garantie est annoncée à 12 mois sur une section, alors que la FAQ indique de 6 à 12 mois selon le véhicule. Pour la reprise, le site promet une estimation gratuite et accepte toutes marques, mais les délais annoncés diffèrent : immédiat, moins d’une heure ou sous 24 heures. Le site mentionne également paiement immédiat et reprise de véhicules accidentés; ces modalités restent à confirmer avant de les garantir.

## Éléments pratiques à confirmer

La page contact du site source affiche les deux numéros +212 678 880 268 et +212 660 889 030, l’adresse e-mail contact.automajorelle@gmail.com, l’adresse du Quartier industriel Sidi Ghanem 127, Marrakech et des horaires du lundi au samedi, 9 h–19 h, avec dimanche sur rendez-vous. Elle annonce aussi des essais routiers sur permis valide. Ces informations sont déjà largement reprises dans le projet, mais doivent être reconfirmées par l’entreprise avant mise en ligne définitive.

## Vérifications techniques

La vérification TypeScript, la compilation statique et les tests Vitest ont réussi. Les tests rapportent six cas réussis. La compilation signale un bundle JavaScript principal volumineux; cette alerte ne bloque pas la compilation.