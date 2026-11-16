# Accès backend — Auto Majorelle

## Liens

- **Administration du site :** ouvrir la route `/admin` depuis l’aperçu Webdev ou le domaine publié.
- **Projet Supabase :** https://supabase.com/dashboard/project/vbcwmymamzrnenyilhau
- **Référence du projet :** `vbcwmymamzrnenyilhau`
- **Région :** `eu-west-3`

## État vérifié le 16 novembre 2026

Le projet Supabase `auto-majorel` est actif et sain. Les tables, les règles RLS, les fonctions et les opérations serveur sont connectées au site. La table `public.admin_users` contient actuellement **0 compte autorisé** : aucun identifiant administrateur ne doit donc être inventé ou partagé.

## Donner l’accès à un administrateur

1. Dans le tableau de bord Supabase, ouvrir **Authentication → Users**.
2. Créer ou inviter le compte avec l’adresse e-mail de la personne qui doit gérer le site.
3. Dans **SQL Editor**, exécuter cette requête en remplaçant l’adresse :

```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'admin'
from auth.users
where lower(email) = lower('ADRESSE_ADMINISTRATEUR')
on conflict (user_id) do update
set email = excluded.email, role = excluded.role;
```

4. Ouvrir `/admin` et se connecter avec ce compte.
5. Vérifier les droits dans **Gestion du site**. Le rôle `admin` donne accès aux véhicules, marques, services, financement, articles, demandes et paramètres.

Il n’existe pas d’inscription publique d’administrateur. Pour retirer un accès, supprimer la ligne correspondante de `public.admin_users` puis désactiver le compte dans **Authentication → Users**.

## Sécurité

La clé publishable peut être utilisée par le navigateur, mais elle ne donne pas de droits d’administration. Les opérations sensibles sont protégées par Supabase Auth, les contrôles serveur et RLS. Ne jamais placer une clé `service_role` dans le navigateur, dans une variable `VITE_*`, dans GitHub ou dans ce guide.
