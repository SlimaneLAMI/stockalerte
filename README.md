# StockAlerte 🇩🇿

Plateforme anti-gaspillage pour le marché algérien — connecte commerçants et clients.

## Stack
- **Next.js 14** (App Router) · JavaScript
- **MongoDB** + Mongoose
- **NextAuth** (Google + Email)
- **Tailwind CSS** (dark mode, RTL)
- **next-intl** (fr / en / ar)
- **Leaflet** (carte)
- **Cloudinary** (images)
- **jsPDF + QRCode** (PDF + QR)

## Démarrage rapide

```bash
# 1. Copier les variables d'environnement
cp .env.local.example .env.local
# Remplir : MONGODB_URI, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET, CLOUDINARY_*

# 2. Installer les dépendances
npm install

# 3. Seed la base de données (catégories + admin)
node scripts/seed.js

# 4. Lancer en développement
npm run dev
```

## Structure

```
app/
  [locale]/           # Routes Next.js (fr, en, ar)
    page.jsx          # Accueil
    discover/         # Découverte offres
    map/              # Carte
    offers/[id]/      # Détail offre
    merchants/[id]/   # Profil commerçant
    auth/             # Login / Register
    dashboard/
      client/         # Espace client
      merchant/       # Espace commerçant
      admin/          # Panel admin
  api/                # Routes API
components/
  layout/             # Navbar, Footer, DashboardLayout
  ui/                 # Cards, Badges, Modal, ImageUpload...
  map/                # OffersMap (Leaflet)
  providers/          # Session, Theme
hooks/                # useOffers, useGeolocation, useFavorite, useFollow
lib/                  # db, auth, utils, qrcode, pdf, cloudinary
models/               # User, MerchantProfile, Offer, Category, Follow...
messages/             # Traductions fr.json, en.json, ar.json
scripts/              # seed.js
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `MONGODB_URI` | URI MongoDB Atlas |
| `NEXTAUTH_SECRET` | Clé secrète NextAuth (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL de l'app (`http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret Google OAuth |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nom cloud Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret Cloudinary |
| `NEXT_PUBLIC_APP_URL` | URL publique |

## Fonctionnalités

- ✅ Authentification Google + email
- ✅ Multilingue FR / EN / AR (RTL natif)
- ✅ Mode clair / sombre
- ✅ Carte des offres (Leaflet + géolocalisation)
- ✅ Publication d'offres (5 types)
- ✅ QR Code PDF commerçant
- ✅ Favoris + Abonnements
- ✅ Notifications
- ✅ Dashboard commerçant (stats, offres, profil)
- ✅ Dashboard client
- ✅ Panel admin (users, offres, signalements)
- ✅ Upload images (Cloudinary)
- ✅ API REST complète

## Licence
MIT — Made with ❤️ in Algeria 🇩🇿
