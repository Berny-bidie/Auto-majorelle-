# submit-trade-in

Fonction publique contrôlée par origine pour recevoir les demandes de reprise. Elle utilise uniquement le rôle de service côté runtime Supabase afin d’écrire dans `leads` et le bucket privé `trade-in-photos`.

Secrets runtime attendus : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (fourni par Supabase) et `ALLOWED_ORIGINS` (origines exactes séparées par des virgules). Ne jamais copier la clé de service dans le dépôt ou le frontend.
