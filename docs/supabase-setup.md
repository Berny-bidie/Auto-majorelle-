# Configuration Supabase — Auto Majorelle

## Projet et variables

Le backend du site est rattaché au projet Supabase `auto-majorel` (`vbcwmymamzrnenyilhau`, région `eu-west-3`). L’URL et la clé **publishable** sont déjà dans `shared/supabaseProject.ts`; elles peuvent être surchargées en local à partir de `.env.example`.

La clé publishable est destinée au navigateur et n’est pas un secret. Elle n’autorise aucune opération administrative à elle seule : l’accès aux tables et fichiers est borné par les politiques RLS, et les mutations admin nécessitent un JWT Supabase Auth dont l’utilisateur est inscrit dans `public.admin_users`. **Ne jamais placer `SUPABASE_SERVICE_ROLE_KEY` dans `.env`, dans une variable `VITE_*`, dans le client ou dans le dépôt.** La seule utilisation du rôle de service est côté Edge Function de reprise, via le secret fourni au runtime Supabase.

Les variables runtime utilisées côté serveur sont `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` (l’ancienne variable `SUPABASE_ANON_KEY` reste acceptée pour compatibilité). Les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont publiques, destinées au client uniquement.

## Premier administrateur

Il n’y a pas d’écran d’inscription public. Le compte administrateur actuellement autorisé est **`bidieberny1@gmail.com`**. Il se gère dans [Supabase Authentication → Users](https://supabase.com/dashboard/project/vbcwmymamzrnenyilhau/auth/users). Si le mot de passe est inconnu, utilisez la réinitialisation Supabase ; aucun mot de passe n’est stocké dans le dépôt ou accessible au frontend.

Après avoir créé l’utilisateur, exécutez une seule fois dans le SQL Editor, en remplaçant l’adresse par celle du compte autorisé :

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'admin'
from auth.users
where lower(email) = lower('bidieberny1@gmail.com')
on conflict (user_id) do update
set email = excluded.email, role = excluded.role;
```

Pour vérifier :

```sql
select user_id, email, role, created_at
from public.admin_users
order by created_at desc
limit 20;
```

L’utilisateur se connecte sur `/admin`. Pour retirer un accès, supprimez la ligne correspondante de `public.admin_users` et désactivez le compte dans Authentication. Le rôle `editor` bénéficie des mêmes protections opérationnelles pour les écrans actuels; le rôle `admin` est destiné à l’administration complète.

## Schéma, sécurité et médias

Les migrations versionnées se trouvent dans `supabase/migrations/`. Le schéma contient `vehicles`, `brands`, `services`, `financing_partners`, `leads`, `blog_posts`, `site_settings` et `admin_users`. Toutes les tables actives sont sous RLS. Les requêtes publiques ne lisent que les annonces disponibles/publiées, les services actifs/publiés, les partenaires confirmés/publiés, les articles publiés et les paramètres marqués publics. Les écritures métier sont réservées aux administrateurs, sauf les insertions explicitement validées des formulaires contact, rendez-vous et financement.

Storage contient deux buckets :

- `public-media` : médias de véhicules, marques, services, articles et partenaires; téléchargement public en lecture, création/modification/suppression par admin seulement.
- `trade-in-photos` : photos de reprise **privées**; les visiteurs n’ont aucun droit de lecture. L’Edge Function `submit-trade-in` valide et écrit les fichiers avec son secret serveur; les admins obtiennent uniquement des URL signées de courte durée.

L’Edge Function autorise les origines de Preview Manus et `localhost` pour le développement. Lorsqu’un domaine public est choisi, configurez le secret Edge Function `ALLOWED_ORIGINS` comme liste séparée par des virgules d’origines exactes avec protocole, par exemple `https://exemple.ma,https://www.exemple.ma`. Ne mettez pas de chemin ni de barre finale.

## Migrations, données et validation

N’exécutez pas les migrations deux fois manuellement. Appliquez les fichiers via l’outil de migration Supabase/CI. Aucun véhicule fictif n’est préchargé. Les marques existantes sont conservées; les services déjà présents sont repris sans ajout de conditions commerciales. Les articles importés et partenaires source restent en brouillon/non confirmés tant que leur contenu ou partenariat n’est pas vérifié.

Pour tester l’accès, utilisez d’abord `/healthz` (HTTP 200), puis vérifiez les routes publiques sans JWT. Dans un navigateur non connecté, `/admin` doit afficher uniquement l’écran de connexion et toute mutation admin via l’API doit renvoyer `UNAUTHORIZED`. Un utilisateur authentifié qui n’est pas présent dans `admin_users` doit recevoir `FORBIDDEN`. Un administrateur peut gérer le catalogue, les marques, les services, les partenaires confirmés, les articles, les demandes, leurs statuts et les coordonnées.
