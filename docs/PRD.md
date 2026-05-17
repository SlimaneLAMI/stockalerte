# PRD — E-commerce Équipements de Cuisine Professionnelle

## Problem Statement

Les professionnels de la restauration (chefs, gérants de restaurant, hôteliers, traiteurs) peinent à trouver un point de vente en ligne fiable pour équiper leurs cuisines professionnelles. Les plateformes généralistes ne proposent pas les filtres métier nécessaires (tension, capacité, puissance, certifications), n'offrent pas de conditions B2B (TVA, devis, virement), et ne gèrent pas les contraintes logistiques spécifiques aux équipements lourds (livraison sur palette, installation sur site). Le résultat : les acheteurs professionnels perdent du temps à contacter des revendeurs par téléphone ou email pour obtenir des informations de base.

---

## Solution

Une boutique en ligne mono-vendeur spécialisée dans les équipements de cuisine professionnelle, conçue pour les acheteurs B2B. Elle propose un catalogue riche avec des filtres métier précis, un parcours d'achat adapté aux professionnels (compte établissement, TVA, paiement par virement), un module de demande de devis pour les commandes volumineuses ou sur mesure, et un suivi de commande transparent incluant la logistique lourde et l'installation.

---

## User Stories

### Navigation & Découverte

1. En tant que gérant de restaurant, je veux parcourir le catalogue par catégorie (cuisson, réfrigération, préparation, laverie) afin de trouver rapidement le type d'équipement dont j'ai besoin.
2. En tant que chef cuisinier, je veux filtrer les produits par capacité (litres, kg/h), puissance (kW), tension (mono/tri) et dimensions afin de sélectionner uniquement les équipements compatibles avec mon installation.
3. En tant qu'acheteur professionnel, je veux filtrer par marque (Rational, Hobart, Electrolux Professional, etc.) afin de rester sur des fournisseurs que je connais.
4. En tant qu'acheteur, je veux filtrer par certifications (CE, NSF, NF Hygiène) afin de m'assurer de la conformité réglementaire.
5. En tant qu'acheteur, je veux trier les résultats par prix croissant/décroissant, nouveautés ou meilleures ventes afin d'organiser ma recherche.
6. En tant que gérant pressé, je veux une barre de recherche full-text avec autocomplétion afin d'accéder directement à un produit sans naviguer dans les catégories.
7. En tant qu'acheteur, je veux voir sur chaque fiche produit les dimensions précises, le poids, la consommation énergétique et les accessoires inclus afin d'évaluer la compatibilité avant d'acheter.
8. En tant qu'acheteur, je veux voir les avis d'autres professionnels sur chaque produit afin de valider mon choix.
9. En tant qu'acheteur, je veux accéder aux fiches techniques (PDF) et aux manuels d'utilisation depuis la fiche produit afin de les transmettre à mon équipe technique.
10. En tant qu'acheteur, je veux voir le stock disponible en temps réel afin de savoir si le produit est immédiatement expédiable.

### Compte & Authentification

11. En tant que nouveau client professionnel, je veux créer un compte "Établissement" avec mon SIRET et mes informations de facturation afin de bénéficier des conditions B2B (TVA intracommunautaire, facturation).
12. En tant que chef particulier, je veux créer un compte "Particulier" simplifié afin d'acheter des équipements semi-professionnels sans justificatif d'entreprise.
13. En tant qu'utilisateur, je veux me connecter via email/mot de passe ou OAuth (Google) afin d'accéder rapidement à mon compte.
14. En tant qu'acheteur récurrent, je veux sauvegarder plusieurs adresses de livraison (restaurant principal, second établissement, entrepôt) afin de gagner du temps lors du checkout.
15. En tant que gérant de chaîne, je veux gérer plusieurs établissements sous un même compte afin de centraliser mes achats.
16. En tant qu'utilisateur, je veux réinitialiser mon mot de passe par email afin de ne pas être bloqué en cas d'oubli.

### Panier & Checkout

17. En tant qu'acheteur, je veux ajouter des produits à un panier persistant (survit à la fermeture du navigateur) afin de reprendre mes achats plus tard.
18. En tant qu'acheteur, je veux modifier la quantité ou supprimer un article du panier afin d'ajuster ma commande.
19. En tant qu'acheteur professionnel, je veux voir le prix HT et TTC séparément dans mon panier afin de faciliter ma comptabilité.
20. En tant que client établissement avec numéro de TVA intracommunautaire valide, je veux que la TVA soit automatiquement exonérée afin de simplifier ma facturation.
21. En tant qu'acheteur, je veux choisir entre livraison standard (messagerie), livraison sur palette (équipements lourds) et retrait en entrepôt afin d'adapter la logistique à mon équipement.
22. En tant qu'acheteur, je veux choisir l'option "installation sur site" lors du checkout afin de planifier une intervention technique.
23. En tant qu'acheteur, je veux payer par carte bancaire, virement SEPA ou avoir l'option paiement à 30 jours (compte professionnel validé) afin d'utiliser le mode de paiement habituel de mon établissement.
24. En tant qu'acheteur, je veux recevoir une confirmation de commande par email avec récapitulatif et facture pro forma afin d'avoir une trace immédiate.
25. En tant qu'acheteur, je veux appliquer un code promotionnel lors du checkout afin de bénéficier des remises en cours.

### Demande de Devis B2B

26. En tant que gérant qui équipe une cuisine complète, je veux soumettre une demande de devis avec une liste de produits et des quantités afin d'obtenir un tarif négocié.
27. En tant que demandeur de devis, je veux joindre un plan ou un cahier des charges à ma demande afin de fournir le contexte nécessaire au vendeur.
28. En tant que demandeur de devis, je veux recevoir une réponse chiffrée dans un délai affiché (ex. 48h ouvrées) afin de planifier mon projet.
29. En tant que demandeur de devis, je veux accepter ou refuser le devis directement depuis mon espace client afin de convertir en commande en un clic.
30. En tant que vendeur (admin), je veux recevoir une notification immédiate pour chaque nouvelle demande de devis afin de répondre dans les délais.
31. En tant que vendeur, je veux modifier le prix unitaire sur le devis avant envoi afin de proposer une remise volume personnalisée.

### Suivi de Commande

32. En tant qu'acheteur, je veux suivre l'état de ma commande (confirmée, en préparation, expédiée, livrée, installée) depuis mon espace client afin d'anticiper la réception.
33. En tant qu'acheteur, je veux recevoir une notification email et/ou SMS à chaque changement de statut de ma commande afin d'être informé sans me connecter.
34. En tant qu'acheteur, je veux accéder au numéro de suivi transporteur cliquable afin de tracker la livraison directement sur le site du transporteur.
35. En tant qu'acheteur, je veux consulter l'historique complet de mes commandes avec les factures téléchargeables afin de les transmettre à mon comptable.
36. En tant qu'acheteur, je veux initier une demande de SAV ou de retour depuis ma commande afin de signaler un problème facilement.

### Avis Produits

37. En tant qu'acheteur ayant reçu sa commande, je veux laisser un avis noté (1-5 étoiles) avec commentaire afin de partager mon expérience.
38. En tant qu'acheteur potentiel, je veux lire des avis vérifiés (achat confirmé uniquement) afin de faire confiance aux retours d'expérience.
39. En tant qu'acheteur, je veux poser une question technique sur une fiche produit afin d'obtenir une réponse du vendeur ou de la communauté.

### Administration

40. En tant qu'admin, je veux créer, modifier et archiver des produits avec images, fiches techniques et attributs métier afin de maintenir le catalogue à jour.
41. En tant qu'admin, je veux gérer le stock de chaque produit (quantité, seuil d'alerte) afin d'éviter les surventes.
42. En tant qu'admin, je veux consulter un tableau de bord avec les KPIs clés (CA du jour, commandes en cours, stock critique) afin de piloter l'activité.
43. En tant qu'admin, je veux gérer les commandes (changer le statut, ajouter un numéro de suivi, générer la facture) afin d'opérer la logistique.
44. En tant qu'admin, je veux créer et gérer des codes promo (montant fixe, pourcentage, usage limité) afin d'animer les ventes.
45. En tant qu'admin, je veux consulter la liste des demandes de devis et y répondre depuis l'interface admin afin de centraliser le traitement commercial.

---

## Implementation Decisions

**Architecture générale**
- Application Next.js (App Router) avec rendu hybride : SSR pour les fiches produits (SEO), CSR pour le panier et l'espace client.
- Base de données PostgreSQL via Prisma ORM.
- Authentification via NextAuth.js (email/password + OAuth Google), avec distinction de rôle entre `CUSTOMER_INDIVIDUAL`, `CUSTOMER_BUSINESS` et `ADMIN`.

**Module Catalogue Produits**
- Modèle produit avec : nom, description, catégorie (relation), marque, SKU, images (tableau), attributs dynamiques (objet JSON pour capacité, puissance, tension, dimensions, certifications), prix HT, TVA applicable, poids, disponibilité.
- Les attributs dynamiques permettent d'ajouter de nouveaux attributs sans migration de schéma.
- Gestion des variantes (ex. même modèle en 220V ou 380V) via un modèle `ProductVariant` lié au produit parent.

**Module Recherche & Filtrage**
- Recherche full-text via PostgreSQL `tsvector` (pas d'Elasticsearch pour la V1).
- Filtres basés sur les attributs du modèle + attributs dynamiques (filtrage sur champ JSON PostgreSQL).
- Interface de filtrage côté client avec URL comme source de vérité (paramètres query) pour permettre le partage de liens filtrés.

**Module Authentification & Comptes**
- À l'inscription "Établissement", validation du SIRET via l'API Sirene (INSEE) pour vérifier l'existence de l'entreprise.
- Le champ TVA intracommunautaire déclenche une exonération automatique de TVA sur le checkout (logique dans le service `PricingService`).
- Plusieurs adresses stockées dans une table `Address` liée au compte utilisateur.

**Module Panier & Checkout**
- Panier stocké en base (table `Cart` + `CartItem`) lié au compte utilisateur, pas en localStorage, pour la persistance cross-device.
- `PricingService` : module isolé qui calcule prix HT, TVA, remises, frais de livraison selon le type de compte et le mode de livraison. Entrée : panier + contexte utilisateur. Sortie : objet `PriceBreakdown` immuable.
- Paiement carte via Stripe (webhooks pour confirmer la commande). Virement SEPA : confirmation manuelle par l'admin.
- Option "paiement à 30 jours" disponible uniquement pour les comptes `CUSTOMER_BUSINESS` marqués comme validés par l'admin.

**Module Demande de Devis**
- Entité `Quote` avec statuts : `PENDING` → `SENT` → `ACCEPTED` / `REJECTED` / `EXPIRED`.
- Un devis accepté génère automatiquement une commande (`Order`) avec le statut `AWAITING_PAYMENT`.
- Notifications admin par email (via Resend ou Nodemailer) à chaque nouvelle demande.

**Module Gestion des Commandes**
- Entité `Order` avec machine à états explicite : `PENDING_PAYMENT` → `CONFIRMED` → `PREPARING` → `SHIPPED` → `DELIVERED` → `INSTALLED` (optionnel) → `COMPLETED`.
- Notifications client (email + optionnel SMS via Twilio) à chaque transition de statut.
- Génération de facture PDF côté serveur (via `@react-pdf/renderer` ou `pdfkit`).

**Module Admin Dashboard**
- Interface admin protégée par rôle `ADMIN`, accessible sous `/admin`.
- Tableau de bord avec agrégats calculés côté serveur (CA, commandes en cours, produits en stock critique).

---

## Testing Decisions

**Philosophie de test**
Tester uniquement le comportement externe observable, jamais les détails d'implémentation. Un bon test échoue quand le comportement change, pas quand le code interne est refactorisé.

**Modules à tester en priorité**

- **`PricingService` (cart-checkout)** — Logique critique avec de nombreux cas limites (exonération TVA, remises cumulées, frais de livraison selon le poids). Tests unitaires purs : entrée → `PriceBreakdown` attendu. Aucune dépendance externe.
- **`search-filter`** — Tests d'intégration sur la couche de requête : vérifier que les combinaisons de filtres retournent les bons produits depuis une base de test seeded. Tester les cas limites : filtres sans résultat, recherche avec caractères spéciaux.
- **`quote-request` (machine à états)** — Tests unitaires sur les transitions de statut autorisées et interdites. Vérifier que l'acceptation d'un devis crée bien une commande avec les bons attributs.

**Modules non testés en V1**
Rendu UI des pages, intégration Stripe (couverte par leurs propres tests), génération PDF.

---

## Out of Scope

- **Marketplace multi-vendeurs** — Architecture mono-vendeur uniquement.
- **Application mobile native** — Site responsive uniquement en V1.
- **Programme de fidélité / points** — Réductions via codes promo uniquement.
- **Configurateur produit** (ex. cuisine sur mesure assemblée à la commande).
- **Chat en direct** avec le support (formulaire de contact + demande de devis suffisent).
- **Internationalisation** — Une seule langue (français) et une seule devise (EUR) en V1.
- **Comparateur de produits** côte à côte.
- **Abonnements / réapprovisionnement automatique**.

---

## Further Notes

- Les équipements lourds (> 30 kg) nécessitent une coordination logistique spéciale : la livraison sur palette et l'option installation doivent être clairement présentées dans le checkout avec un délai de livraison distinct (J+5 à J+10 vs J+2 standard).
- Le tunnel de conversion B2B est différent du B2C : il faut optimiser pour la demande de devis autant que pour l'achat direct.
- La validation SIRET à l'inscription est un signal de confiance fort pour les acheteurs professionnels — elle doit être visible dans l'interface ("Compte professionnel vérifié").
- Prévoir dès la V1 un champ `metaTitle` / `metaDescription` sur les produits pour le SEO, car le référencement organique sur les équipements professionnels est un canal d'acquisition important.
