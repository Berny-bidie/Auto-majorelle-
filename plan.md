# Plan d’implémentation — Phase backend Auto Majorel

## Contexte et décisions

Le dépôt fourni est une application React/Vite/TypeScript avec Express, tRPC et Drizzle. Sa persistance actuelle est MySQL (`mysql2`, `DATABASE_URL`), et l’administration existe déjà à `/admin` mais son accès est visible depuis l’en-tête public. Le site public, ses pages, composants, médias, animations et styles doivent être conservés. Le projet Supabase dédié `auto-majorel` (`vbcwmymamzrnenyilhau`) est actif dans `eu-west-3` et encore vide. Le projet distinct `eco-habitat` ne sera pas utilisé.

Le projet WebDev `Auto Majorel` est initialisé avec serveur actif, port 3000 et base gérée Manus désactivée : Supabase restera l’unique base externe de l’application.

## Approche d’implémentation

1. Importer dans l’espace WebDev le code et les ressources du ZIP fourni, puis garder l’architecture Vite/React/Express/tRPC. Préserver les routes et les contenus existants tout en faisant évoluer le système visuel de façon cohérente. Retirer du `SiteShell` les liens d’administration visibles du menu public ; conserver une route directe `/admin` sans lien public.
2. Remplacer la couche Drizzle/MySQL par le SDK Supabase et des requêtes serveur tRPC. Les clés de navigateur seront limitées à l’URL Supabase et à la clé publishable ; aucune clé `service_role` ne sera ajoutée au client ni au dépôt. Les requêtes transmettront le JWT de session Supabase Auth et seront également protégées par RLS.
3. Créer une migration PostgreSQL versionnée pour les administrateurs, marques, véhicules, services, partenaires/conditions de financement confirmés, demandes (contact, essai, financement, reprise), articles et paramètres du site. Les informations inconnues resteront absentes ou explicitement à confirmer ; aucun véhicule, avis, taux ou partenariat fictif ne sera créé.
4. Activer RLS sur les tables et les objets Storage. Les visiteurs pourront lire uniquement les contenus publiés destinés au public et soumettre des demandes validées ; seuls les comptes Auth inscrits dans `admin_users` pourront gérer les contenus, lire les demandes et modifier les paramètres. Aucun endpoint d’inscription administrateur public ne sera exposé.
5. Remplacer l’authentification actuelle par Supabase Auth (connexion e-mail/mot de passe, session, contrôle du rôle administrateur et déconnexion). L’administration conservera `/admin`, sans lien depuis le site public. Les instructions expliqueront comment créer/inviter le premier utilisateur puis l’autoriser dans `admin_users` ; aucune adresse de connexion ne sera présumée.
6. Créer un bucket public de médias véhicules (lecture publique, écriture admin) et un bucket privé pour les photos sensibles de reprise (pas de lecture anonyme, taille/type contrôlés, consultation réservée aux administrateurs). Les photos du formulaire de reprise seront validées côté serveur et les demandes/chemins enregistrés de façon cohérente.
7. Relier catalogue, filtres, fiches, blog, coordonnées, formulaires, upload photo et administration aux données Supabase en conservant les états de chargement, succès, erreur et vide déjà prévus. Le simulateur n’utilisera pas de taux non vérifié ; le contenu de démonstration du blog ne sera pas publié automatiquement.
8. Livrer les migrations SQL, les politiques RLS/Storage, `.env.example`, les consignes de configuration, de création du premier administrateur, de déploiement et d’association du sous-domaine `admin.[DOMAINE-FINAL]`. Garder la configuration réelle sans secret dans le dépôt.

## Structure du projet

- `client/src/pages/` et `client/src/components/` : pages publiques et panneaux d’administration existants, conservés et connectés aux données réelles.
- `client/src/lib/` et `client/src/_core/` : client Supabase navigateur, session Auth et liaison tRPC.
- `server/` : routes Express/tRPC, validation serveur, vérification de session et opérations Supabase avec les droits de l’utilisateur courant.
- `shared/` : types de données et validations partagés.
- `supabase/migrations/` : schéma PostgreSQL, index, RLS, fonctions et politiques Storage versionnés.
- `docs/` : guide Supabase, bootstrap du premier administrateur, variables d’environnement et déploiement.
- `client/public/manus-routes.json` : routes publiques et route d’administration maintenues en cohérence avec l’application.

## Design

Choisir une direction **automobile éditoriale premium** : compositions asymétriques, grandes accroches typographiques, photos réelles du showroom, accents rouges contrôlés et surfaces anthracite pour guider le parcours. Les principes sont la lisibilité d’abord, la preuve avant la promesse et un appel à l’action unique par étape.

- **Mouvement** : magazine automobile contemporain, précis et tactile.
- **Couleurs** : rouge Auto Majorelle pour l’action et la signature, anthracite pour la confiance, ivoire pour laisser respirer les photos et les textes.
- **Signature** : filets rouges, cartes éditoriales, photos avec légendes et repères géographiques Marrakech / Alfa 2000.
- **Interaction** : hover discret, focus clavier visible, navigation active, CTA mobile persistant pour appeler ou écrire sur WhatsApp. Normaliser les contrôles en trois niveaux (standard, compact, hero) afin de conserver des hauteurs et des espacements prévisibles sur chaque format.
- **Contenu externe** : ne retenir d’un texte concurrent que les thèmes génériques utiles à l’information automobile ; réécrire pour Auto Majorelle et ne pas importer ses noms, garanties, chiffres de contrôle ou promesses non vérifiées.
- **Typographie** : Manrope, titres serrés à fort contraste de taille, microcopies courtes en capitales espacées.
- **Voix** : directe, locale et honnête. Exemple : « Voir la voiture autrement. » et « Préparer votre projet, sans promesse floue. »

## Refonte éditoriale multi-pages

La référence Global Occaz sert uniquement à observer des parcours utiles : recherche par critères, stock récent, reprise en étapes, financement expliqué, réassurance et FAQ. Chaque page Auto Majorelle doit rester locale, sobre et vérifiable : une intention principale, une preuve visuelle, un texte court et un appel à l’action cohérent. Les mentions internes de recherche, de site source ou de dossier historique ne doivent jamais apparaître dans l’espace public.

## Limites de cette phase

Le domaine final et l’adresse e-mail du premier administrateur ne sont pas fournis. Le site ne sera donc pas publié sur un domaine ni configuré avec un compte d’administration présumé ; les étapes exactes de personnalisation seront documentées. Aucun contenu commercial douteux ou annonce de test ne sera importé en base comme vérité confirmée.
