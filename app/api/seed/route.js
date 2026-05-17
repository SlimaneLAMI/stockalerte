import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Brand from '@/models/Brand';
import SiteSettings from '@/models/SiteSettings';

export async function POST() {
  try {
    await connectDB();

    // Drop entire database to ensure a clean slate
    await mongoose.connection.db.dropDatabase();

    // Re-connect models after drop (indexes need to be recreated)
    await connectDB();

    const categories = await Category.insertMany([
      {
        name: 'Cuisson',
        slug: 'cuisson',
        description: 'Fours professionnels, pianos de cuisine, plaques de cuisson et équipements de cuisson haute performance.',
        bannerImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
        icon: '🔥',
        order: 1,
      },
      {
        name: 'Réfrigération',
        slug: 'refrigeration',
        description: 'Armoires réfrigérées, chambres froides, vitrines réfrigérées pour la conservation optimale de vos produits.',
        bannerImage: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200&q=80',
        icon: '❄️',
        order: 2,
      },
      {
        name: 'Préparation',
        slug: 'preparation',
        description: 'Robots culinaires, trancheuses, hachoirs et équipements de préparation pour optimiser votre production.',
        bannerImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
        icon: '⚙️',
        order: 3,
      },
    ]);

    const brands = await Brand.insertMany([
      { name: 'Rational', website: 'https://rational-online.com' },
      { name: 'Hobart', website: 'https://hobartcorp.com' },
      { name: 'Electrolux Professional', website: 'https://electroluxprofessional.com' },
      { name: 'Fagor', website: 'https://fagorprofessional.com' },
      { name: 'Zanussi Professional', website: 'https://zanussiprofessional.com' },
    ]);

    await Product.insertMany([
      {
        name: 'Four Combi SelfCookingCenter 61',
        slug: 'four-combi-selfcookingcenter-61',
        categoryId: categories[0]._id,
        brand: 'Rational',
        shortDesc: 'Four mixte intelligent 6 niveaux GN 1/1 avec cuisson automatique et nettoyage intégré.',
        longDesc: '<p>Le SelfCookingCenter® reconnaît automatiquement chaque aliment, la quantité en cours et son état de cuisson. Il ajuste immédiatement tous les paramètres de cuisson pour vous garantir exactement le résultat que vous désirez.</p><p>Grâce à la technologie iCookingSuite, vous obtenez des plats parfaitement cuits, quelle que soit la quantité, à chaque fois et sans effort.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', publicId: 'demo1' },
          { url: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=80', publicId: 'demo2' },
        ],
        price: 8900,
        priceVisible: true,
        availability: 'En stock',
        specs: {
          'Dimensions (L×l×H)': '847 × 771 × 883 mm',
          'Poids': '105 kg',
          'Puissance': '11 kW',
          'Tension': '400V triphasé',
          'Capacité': '6 niveaux GN 1/1',
          'Certifications': 'CE, NF Hygiène',
          'Garantie': "2 ans pièces et main-d'œuvre",
          'Référence': 'RATIONAL-SCC61-G',
        },
        featured: true,
        published: true,
        metaTitle: 'Four Combi Rational SelfCookingCenter 61 | StockAlerte',
        metaDesc: 'Four mixte professionnel 6 niveaux Rational. Cuisson automatique intelligente pour restaurants et collectivités.',
      },
      {
        name: 'Armoire Réfrigérée Positive 700L',
        slug: 'armoire-refrigeree-positive-700l',
        categoryId: categories[1]._id,
        brand: 'Electrolux Professional',
        shortDesc: 'Armoire réfrigérée positive 700 litres, 2 portes, inox AISI 304, refroidissement ventilé.',
        longDesc: '<p>Armoire réfrigérée professionnelle en inox brossé, idéale pour les cuisines à forte activité. Système de refroidissement ventilé pour une distribution homogène de la température.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80', publicId: 'demo3' },
        ],
        price: 2400,
        priceVisible: true,
        availability: 'En stock',
        specs: {
          'Dimensions (L×l×H)': '1340 × 720 × 2060 mm',
          'Poids': '130 kg',
          'Puissance': '0.45 kW',
          'Tension': '230V monophasé',
          'Capacité': '700 litres',
          'Température': '0°C à +10°C',
          'Certifications': 'CE, NF Hygiène',
          'Garantie': '2 ans',
          'Référence': 'EP-AR700-2P',
        },
        featured: true,
        published: true,
      },
      {
        name: 'Robot Coupe-Légumes R 402',
        slug: 'robot-coupe-legumes-r402',
        categoryId: categories[2]._id,
        brand: 'Hobart',
        shortDesc: 'Robot combiné préparation légumes, 4 disques inclus, capacité 8L, idéal pour 200 à 400 couverts.',
        longDesc: '<p>Le robot coupe-légumes R402 est la solution indispensable pour les cuisines professionnelles traitant de grands volumes. Sa conception robuste et ses 4 disques interchangeables permettent de traiter une large variété de légumes en un minimum de temps.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', publicId: 'demo4' },
        ],
        price: 1850,
        priceVisible: true,
        availability: 'Sur commande',
        specs: {
          'Dimensions (L×l×H)': '380 × 280 × 480 mm',
          'Poids': '14 kg',
          'Puissance': '1.5 kW',
          'Tension': '230V monophasé',
          'Capacité': '8 litres',
          'Débit': '80 kg/h',
          'Certifications': 'CE',
          'Garantie': '1 an',
          'Référence': 'HBT-R402-P',
        },
        featured: true,
        published: true,
      },
      {
        name: 'Piano de Cuisson 4 Feux + Gril',
        slug: 'piano-cuisson-4-feux-gril',
        categoryId: categories[0]._id,
        brand: 'Fagor',
        shortDesc: 'Piano professionnel 4 feux vifs + plaque coup de feu + gril, largeur 1200mm, tout gaz.',
        longDesc: '<p>Piano de cuisson professionnel gamme 700 série complète. Robustesse et performance pour les cuisines les plus exigeantes. Brûleurs vifs hautes performances pour une montée en température ultra-rapide.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', publicId: 'demo5' },
        ],
        price: 3200,
        priceVisible: false,
        availability: 'En stock',
        specs: {
          'Dimensions (L×l×H)': '1200 × 700 × 900 mm',
          'Poids': '165 kg',
          'Puissance': '32 kW',
          'Tension': 'Gaz naturel/propane',
          'Feux': '4 feux vifs + coup de feu',
          'Certifications': 'CE, NF Gaz',
          'Garantie': '2 ans',
          'Référence': 'FGR-PC4FG-1200',
        },
        featured: false,
        published: true,
      },
      {
        name: 'Cellule de Refroidissement 10 Niveaux',
        slug: 'cellule-refroidissement-10-niveaux',
        categoryId: categories[1]._id,
        brand: 'Zanussi Professional',
        shortDesc: 'Cellule de refroidissement rapide et surgélation 10 niveaux GN 1/1, cycle automatique.',
        longDesc: '<p>Cellule de refroidissement rapide professionnelle. Passage de +90°C à +3°C en moins de 90 minutes. Idéale pour la liaison froide en restauration collective et traiteurs.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=800&q=80', publicId: 'demo6' },
        ],
        price: 4600,
        priceVisible: true,
        availability: 'Sur commande',
        specs: {
          'Dimensions (L×l×H)': '860 × 800 × 1950 mm',
          'Poids': '210 kg',
          'Puissance': '3.2 kW',
          'Tension': '400V triphasé',
          'Capacité': '10 niveaux GN 1/1',
          'Certifications': 'CE, NF Hygiène',
          'Garantie': '2 ans',
          'Référence': 'ZNS-CR10-GN',
        },
        featured: true,
        published: true,
      },
      {
        name: 'Trancheuse à Jambon 300mm',
        slug: 'trancheuse-jambon-300mm',
        categoryId: categories[2]._id,
        brand: 'Hobart',
        shortDesc: 'Trancheuse professionnelle lame 300mm, épaisseur réglable 0-15mm, structure aluminium anodisé.',
        longDesc: '<p>Trancheuse semi-automatique de qualité professionnelle. Lame acier inox chromé ø300mm, affûteur intégré. Idéale pour charcuteries, traiteurs et grandes surfaces.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1607197109166-f3f584cd8ba0?w=800&q=80', publicId: 'demo7' },
        ],
        price: 980,
        priceVisible: true,
        availability: 'En stock',
        specs: {
          'Dimensions (L×l×H)': '620 × 440 × 440 mm',
          'Poids': '22 kg',
          'Puissance': '0.22 kW',
          'Tension': '230V monophasé',
          'Diamètre lame': '300 mm',
          'Épaisseur de coupe': '0-15 mm',
          'Certifications': 'CE, NF Hygiène',
          'Garantie': '1 an',
          'Référence': 'HBT-TS300-SA',
        },
        featured: false,
        published: true,
      },
      {
        name: 'Four à Convection 4 Niveaux',
        slug: 'four-convection-4-niveaux',
        categoryId: categories[0]._id,
        brand: 'Zanussi Professional',
        shortDesc: 'Four à convection forcée 4 niveaux 600×400mm, injection vapeur, température 50-270°C.',
        longDesc: '<p>Four professionnel à convection forcée avec injection de vapeur. Idéal pour la boulangerie, la pâtisserie et la restauration. Porte vitrée double vitrage avec éclairage intérieur LED.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', publicId: 'demo8' },
        ],
        price: 2800,
        priceVisible: true,
        availability: 'En stock',
        specs: {
          'Dimensions (L×l×H)': '855 × 780 × 640 mm',
          'Poids': '78 kg',
          'Puissance': '7.2 kW',
          'Tension': '400V triphasé',
          'Capacité': '4 niveaux 600×400mm',
          'Certifications': 'CE',
          'Garantie': '2 ans',
          'Référence': 'ZNS-FC4N-600',
        },
        featured: false,
        published: true,
      },
      {
        name: 'Lave-Vaisselle à Capot Professionnel',
        slug: 'lave-vaisselle-capot-professionnel',
        categoryId: categories[2]._id,
        brand: 'Electrolux Professional',
        shortDesc: 'Lave-vaisselle à capot 60×60cm, 60-120 paniers/heure, chaudière intégrée, rinçage haute temp.',
        longDesc: '<p>Lave-vaisselle professionnel à chargement frontal par capot. Cycle court de 90 secondes pour les couverts. Système d\'économie d\'eau automatique. Idéal pour restaurants de 80 à 200 couverts.</p>',
        images: [
          { url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80', publicId: 'demo9' },
        ],
        price: 3500,
        priceVisible: true,
        availability: 'En stock',
        specs: {
          'Dimensions (L×l×H)': '700 × 720 × 1475 mm',
          'Poids': '90 kg',
          'Puissance': '7.5 kW',
          'Tension': '400V triphasé',
          'Capacité': '120 paniers/heure',
          'Temp. rinçage': '85°C',
          'Certifications': 'CE, NF Hygiène',
          'Garantie': '2 ans',
          'Référence': 'EP-LVC-6060',
        },
        featured: true,
        published: true,
      },
    ]);

    const defaultSettings = [
      { key: 'hero_title', value: 'L\'équipement professionnel qui fait la différence' },
      { key: 'hero_subtitle', value: 'Matériel de cuisine professionnel sélectionné pour les chefs exigeants. Livraison, installation et SAV inclus.' },
      { key: 'hero_cta', value: 'Voir le catalogue' },
      { key: 'hero_image', value: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80' },
      { key: 'why_us', value: [
        { icon: '🏆', title: 'Marques premium', text: 'Exclusivement des équipements de marques reconnues et éprouvées en milieu professionnel.' },
        { icon: '🔧', title: 'SAV réactif', text: 'Techniciens certifiés, intervention sous 48h sur tout le territoire pour maintenir votre activité.' },
        { icon: '📦', title: 'Livraison & installation', text: 'Service clé en main : livraison sur palette, mise en place et formation de votre équipe.' },
      ]},
      { key: 'company_name', value: 'StockAlerte' },
      { key: 'company_address', value: '15 rue des Cuisiniers, 69002 Lyon' },
      { key: 'company_phone', value: '04 72 00 00 00' },
      { key: 'company_email', value: 'contact@StockAlerte.fr' },
      { key: 'company_hours', value: 'Lun–Ven 8h30–18h' },
      { key: 'maps_url', value: 'https://maps.google.com/?q=Lyon,France' },
      { key: 'show_prices', value: true },
      { key: 'footer_text', value: '© 2024 StockAlerte. Tous droits réservés.' },
      { key: 'social_linkedin', value: '' },
      { key: 'social_instagram', value: '' },
    ];

    await SiteSettings.insertMany(defaultSettings);

    return NextResponse.json({
      success: true,
      message: `Seeded: ${categories.length} catégories, ${brands.length} marques, 8 produits`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
