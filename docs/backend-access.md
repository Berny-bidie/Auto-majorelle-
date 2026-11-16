# Accès backend — Auto Majorelle

## Liens

- **Administration du site :** ouvrir la route `/admin` depuis l’aperçu Webdev ou le domaine publié.
- **Utilisateurs Supabase :** https://supabase.com/dashboard/project/vbcwmymamzrnenyilhau/auth/users
- **Projet Supabase :** https://supabase.com/dashboard/project/vbcwmymamzrnenyilhau
- **E-mail exact à saisir :** `bidieberny1@gmail.com`
- **Référence du projet :** `vbcwmymamzrnenyilhau`
- **Région :** `eu-west-3`

## État vérifié le 16 novembre 2026

Le projet Supabase `auto-majorel` est actif et sain. Les tables, les règles RLS, les fonctions et les opérations serveur sont connectées au site. Le compte `bidieberny1@gmail.com` a été retrouvé dans Supabase Auth et autorisé dans `public.admin_users` avec le rôle `admin`.

## Donner l’accès à un administrateur

1. Ouvrir [Supabase Authentication → Users](https://supabase.com/dashboard/project/vbcwmymamzrnenyilhau/auth/users).
2. Utiliser le compte `bidieberny1@gmail.com`.
3. Si le mot de passe est inconnu, sélectionner ce compte et lancer la réinitialisation du mot de passe depuis Supabase.
4. Dans **SQL Editor**, exécuter cette requête uniquement pour un autre administrateur :

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'admin'
from auth.users
where lower(email) = lower('ADRESSE_ADMINISTRATEUR')
on conflict (user_id) do update
set email = excluded.email, role = excluded.role;
```

5. Ouvrir `/admin` et saisir `bidieberny1@gmail.com` avec le mot de passe défini dans Supabase.
6. Vérifier les droits dans **Gestion du site**. Le rôle `admin` donne accès aux véhicules, marques, services, financement, articles, demandes et paramètres.

Il n’existe pas d’inscription publique d’administrateur. Pour retirer un accès, supprimer la ligne correspondante de `public.admin_users` puis désactiver le compte dans **Authentication → Users**.

## Sécurité

La clé publishable peut être utilisée par le navigateur, mais elle ne donne pas de droits d’administration. Les opérations sensibles sont protégées par Supabase Auth, les contrôles serveur et RLS. Ne jamais placer une clé `service_role` dans le navigateur, dans une variable `VITE_*`, dans GitHub ou dans ce guide.
