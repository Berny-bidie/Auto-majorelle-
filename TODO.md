# TODO — Phase 2 : Backend, Supabase et administration privée Auto Majorel

## 0. Finition UX/UI — passe actuelle
- [x] Appliquer une direction automobile éditoriale premium à l’accueil et aux pages publiques, avec une hiérarchie typographique forte, des photos réelles du showroom et des accents rouges réservés aux actions.
- [x] Harmoniser les boutons, les cartes, les formulaires, les états focus/hover et la navigation active sur les pages Accueil, Véhicules, Services, Financement, Reprise, Blog, À propos et Contact.
- [x] Ajouter une navigation mobile claire avec actions persistantes Appeler et WhatsApp, sans masquer le contenu ni supprimer les routes existantes.
- [x] Vérifier les routes principales, le typecheck, les tests et le build après la passe de design.

## 1. Préserver le frontend existant
- [ ] Conserver intégralement le design, les couleurs, les animations, les composants et la structure actuels.
- [ ] Ne pas recommencer le site et ne pas modifier inutilement son design.
- [ ] Ne supprimer aucune page publique déjà créée.
- [ ] Ne pas modifier l’identité visuelle.
- [ ] Remplacer progressivement les données fictives ou statiques par les données provenant de la base de données.
- [ ] S’assurer que toutes les pages restent fonctionnelles après la connexion au backend et ne casser aucune fonctionnalité existante.

## 2. Retirer les accès administratifs du site public
- [ ] Supprimer le bouton administratif présent sur le frontend public.
- [ ] Supprimer tout lien vers le tableau de bord dans les menus, les pieds de page et les autres espaces accessibles aux visiteurs.
- [ ] Ne pas remplacer ces liens par un autre bouton similaire.
- [ ] Ne pas proposer de création de compte obligatoire pour les visiteurs.
- [ ] Garder le site public exclusivement destiné aux clients : consultation des véhicules, informations, financement, reprise, contact et demandes d’essai.

## 3. Créer une administration privée et authentifiée
- [ ] Rendre l’administration accessible directement à une URL privée, indépendante de la navigation publique.
- [ ] Préparer `/admin` tant que la configuration du domaine final n’est pas disponible ; le sous-domaine souhaité est `admin.[DOMAINE-FINAL]`.
- [ ] Protéger l’administration avec une authentification sécurisée : page de connexion administrateur, gestion des sessions, protection des routes administratives, déconnexion sécurisée et rôles/permissions si plusieurs administrateurs sont nécessaires.
- [ ] Garder l’administration comme une interface web privée, séparée du site public mais connectée au même backend et à la même base de données.
- [ ] Ne créer aucun parcours d’inscription publique d’administrateur.

## 4. Mettre en place Supabase
- [ ] Utiliser Supabase PostgreSQL pour la base de données.
- [ ] Utiliser Supabase Auth pour l’authentification des administrateurs.
- [ ] Utiliser Supabase Storage pour les photos des véhicules et les médias.
- [ ] Activer et configurer correctement Row Level Security (RLS) pour protéger les données.
- [ ] Utiliser les API et fonctions serveur nécessaires aux opérations.
- [ ] Ne jamais exposer la clé `service_role` dans le navigateur ; utiliser des variables d’environnement et les contrôles côté serveur.
- [ ] Conserver l’architecture frontend React/Vite/TypeScript et serveur Express/tRPC/Drizzle du dépôt fourni ; ne pas refaire le site.

## 5. Créer la base de données complète
- [ ] Prévoir les véhicules avec marque, modèle, année, prix en MAD (DH), kilométrage, motorisation, transmission, carburant, description, caractéristiques, photos, disponibilité et date de publication.
- [ ] Prévoir les marques avec nom, logo et description éventuelle.
- [ ] Prévoir les services avec nom, description et images.
- [ ] Prévoir le financement avec partenaires, logos, informations et conditions réellement confirmées ; paramètres du simulateur uniquement si les taux sont disponibles et vérifiés.
- [ ] Prévoir les demandes de reprise avec informations du véhicule proposé, photos, coordonnées du demandeur, date de réception et statut.
- [ ] Prévoir les demandes clients avec nom, téléphone, e-mail, véhicule concerné, type de demande, message, date et statut de traitement.
- [ ] Prévoir le blog avec titre, image, contenu, catégorie, date de publication et statut.
- [ ] Prévoir la configuration du site : coordonnées, téléphone, WhatsApp, adresse, horaires, réseaux sociaux et informations générales.
- [ ] Ne pas créer de fausses informations pour compléter les champs manquants ; utiliser les informations réelles déjà disponibles dans le projet.

## 6. Développer le tableau de bord administrateur
- [ ] Permettre d’ajouter, modifier et supprimer un véhicule.
- [ ] Permettre d’ajouter plusieurs photos à chaque véhicule.
- [ ] Permettre de modifier prix et caractéristiques.
- [ ] Permettre de modifier la disponibilité d’un véhicule.
- [ ] Permettre de publier ou dépublier une annonce.
- [ ] Permettre de gérer les marques.
- [ ] Permettre de gérer les services.
- [ ] Permettre de consulter et gérer les demandes clients.
- [ ] Permettre de consulter les demandes de financement et de reprise.
- [ ] Permettre de créer, modifier et supprimer des articles de blog.
- [ ] Permettre de modifier les coordonnées et les informations du site.
- [ ] Permettre de consulter les statistiques principales.
- [ ] Enregistrer toutes les modifications d’administration dans Supabase et les refléter automatiquement sur le site public lorsque cela est pertinent.

## 7. Connecter les fonctionnalités du frontend au backend
- [ ] Afficher au catalogue les véhicules disponibles dans la base de données.
- [ ] Faire fonctionner les filtres et la recherche avec les données réelles.
- [ ] Faire afficher sur chaque fiche véhicule ses informations et sa galerie réelles.
- [ ] Enregistrer les demandes envoyées par les formulaires de contact.
- [ ] Enregistrer les demandes d’essai.
- [ ] Enregistrer le formulaire de reprise avec les informations et les photos.
- [ ] Charger le contenu du blog depuis la base de données.
- [ ] Rendre les informations de contact administrables.
- [ ] Faire utiliser au simulateur de financement uniquement des paramètres confirmés.
- [ ] Prévoir validations, messages de confirmation et gestion correcte des erreurs.

## 8. Sécurité et qualité
- [ ] Protéger toutes les routes administratives.
- [ ] Empêcher les visiteurs non autorisés de modifier les données.
- [ ] Configurer correctement les politiques RLS.
- [ ] Valider les données côté serveur.
- [ ] Sécuriser les fichiers et les téléchargements.
- [ ] Ne jamais exposer d’informations confidentielles.
- [ ] Prévoir états de chargement, erreurs et états vides.
- [ ] Éviter les doublons de demandes.
- [ ] Vérifier les permissions sur toutes les opérations sensibles.

## 9. Vérification finale
- [ ] Vérifier que le site public fonctionne toujours.
- [ ] Vérifier que le bouton administratif a totalement disparu du frontend public.
- [ ] Vérifier que l’URL privée permet d’accéder à l’administration après authentification.
- [ ] Vérifier qu’un visiteur non connecté ne peut pas accéder aux fonctions administratives.
- [ ] Ajouter un véhicule depuis l’administration et vérifier qu’il apparaît sur le site public.
- [ ] Modifier son prix et vérifier la mise à jour.
- [ ] Tester les formulaires et vérifier l’enregistrement des demandes.
- [ ] Tester les téléchargements de photos.
- [ ] Vérifier les erreurs et les problèmes de connexion à Supabase.

## 10. Livrables et configuration
- [ ] Fournir le schéma complet de la base de données.
- [ ] Fournir les migrations SQL.
- [ ] Fournir les politiques de sécurité RLS.
- [ ] Fournir les variables d’environnement nécessaires.
- [ ] Fournir les instructions de configuration Supabase.
- [ ] Fournir les instructions de connexion et de création du premier administrateur.
- [ ] Fournir les instructions de déploiement.
- [ ] Fournir les étapes pour connecter le sous-domaine administratif au projet.
- [ ] Livrer une application réellement connectée à une base de données, pas une simple démonstration avec des données fictives ; le site public et l’administration doivent fonctionner ensemble tout en restant deux espaces distincts.
