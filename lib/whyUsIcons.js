'use client';
import {
  Shield, Truck, Wrench, Star, Clock, CheckCircle, Award,
  Headphones, Package, Zap, ThumbsUp, Settings, Users,
  MapPin, CreditCard, RefreshCw, Layers, BarChart2, Lock,
  Leaf, Globe, Coffee, Box, Smile, Heart, Flame, Cpu,
  Briefcase, Phone, Bell, BookOpen, Calendar, Compass,
  Download, Eye, Filter, Gift, Home, Key, LifeBuoy,
  MessageCircle, Navigation, PieChart, Power, Repeat,
  Search, Send, Server, Share2, ShoppingBag, ShoppingCart,
  Sliders, Smartphone, Tag, Target, TrendingUp, Umbrella,
  UserCheck, Wifi, Wind,
} from 'lucide-react';

export const WHY_US_ICONS = [
  // Qualité & confiance
  { key: 'shield',        label: 'Garantie',      Icon: Shield },
  { key: 'award',         label: 'Excellence',    Icon: Award },
  { key: 'star',          label: 'Qualité',       Icon: Star },
  { key: 'check',         label: 'Certifié',      Icon: CheckCircle },
  { key: 'user_check',    label: 'Validé',        Icon: UserCheck },
  { key: 'thumbs',        label: 'Satisfaction',  Icon: ThumbsUp },
  { key: 'heart',         label: 'Passion',       Icon: Heart },
  { key: 'smile',         label: 'Confiance',     Icon: Smile },

  // Livraison & logistique
  { key: 'truck',         label: 'Livraison',     Icon: Truck },
  { key: 'package',       label: 'Colis',         Icon: Package },
  { key: 'box',           label: 'Stock',         Icon: Box },
  { key: 'refresh',       label: 'Retour',        Icon: RefreshCw },
  { key: 'cart',          label: 'Commande',      Icon: ShoppingCart },
  { key: 'bag',           label: 'Achat',         Icon: ShoppingBag },
  { key: 'download',      label: 'Télécharg.',    Icon: Download },
  { key: 'send',          label: 'Expédition',    Icon: Send },

  // Technique & performance
  { key: 'wrench',        label: 'Maintenance',   Icon: Wrench },
  { key: 'settings',      label: 'Technique',     Icon: Settings },
  { key: 'zap',           label: 'Performance',   Icon: Zap },
  { key: 'cpu',           label: 'Technologie',   Icon: Cpu },
  { key: 'server',        label: 'Serveur',       Icon: Server },
  { key: 'sliders',       label: 'Réglages',      Icon: Sliders },
  { key: 'power',         label: 'Puissance',     Icon: Power },
  { key: 'flame',         label: 'Intensité',     Icon: Flame },

  // Service & équipe
  { key: 'headphones',    label: 'Support',       Icon: Headphones },
  { key: 'users',         label: 'Équipe',        Icon: Users },
  { key: 'phone',         label: 'Téléphone',     Icon: Phone },
  { key: 'message',       label: 'Conseils',      Icon: MessageCircle },
  { key: 'lifebuoy',      label: 'Assistance',    Icon: LifeBuoy },
  { key: 'bell',          label: 'Alertes',       Icon: Bell },
  { key: 'calendar',      label: 'Rendez-vous',   Icon: Calendar },
  { key: 'briefcase',     label: 'Professionnel', Icon: Briefcase },

  // Localisation & réseau
  { key: 'pin',           label: 'Local',         Icon: MapPin },
  { key: 'globe',         label: 'International', Icon: Globe },
  { key: 'compass',       label: 'Orientation',   Icon: Compass },
  { key: 'navigation',    label: 'Navigation',    Icon: Navigation },
  { key: 'home',          label: 'Présence',      Icon: Home },
  { key: 'wifi',          label: 'Connecté',      Icon: Wifi },

  // Finance & croissance
  { key: 'card',          label: 'Paiement',      Icon: CreditCard },
  { key: 'chart',         label: 'Expertise',     Icon: BarChart2 },
  { key: 'pie',           label: 'Statistiques',  Icon: PieChart },
  { key: 'trending',      label: 'Croissance',    Icon: TrendingUp },
  { key: 'gift',          label: 'Offres',        Icon: Gift },
  { key: 'tag',           label: 'Prix',          Icon: Tag },

  // Durabilité & sécurité
  { key: 'leaf',          label: 'Écologie',      Icon: Leaf },
  { key: 'wind',          label: 'Durabilité',    Icon: Wind },
  { key: 'umbrella',      label: 'Protection',    Icon: Umbrella },
  { key: 'lock',          label: 'Sécurité',      Icon: Lock },
  { key: 'eye',           label: 'Transparence',  Icon: Eye },
  { key: 'layers',        label: 'Gamme',         Icon: Layers },

  // Restauration & cuisine
  { key: 'coffee',        label: 'Restauration',  Icon: Coffee },
  { key: 'target',        label: 'Précision',     Icon: Target },
  { key: 'repeat',        label: 'Fiabilité',     Icon: Repeat },
  { key: 'clock',         label: 'Délai',         Icon: Clock },
  { key: 'filter',        label: 'Sélection',     Icon: Filter },
  { key: 'book',          label: 'Formation',     Icon: BookOpen },
  { key: 'key',           label: 'Accès',         Icon: Key },
  { key: 'search',        label: 'Recherche',     Icon: Search },
  { key: 'share',         label: 'Partage',       Icon: Share2 },
  { key: 'smartphone',    label: 'Mobile',        Icon: Smartphone },
];

export function getIcon(key) {
  return WHY_US_ICONS.find(i => i.key === key)?.Icon ?? null;
}
