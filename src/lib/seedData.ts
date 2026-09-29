import heroImage from '../assets/images/hero_tumbler_1790707263337.jpg';
import matteBlackImage from '../assets/images/tumbler_matte_black_1790707225953.jpg';
import goldImage from '../assets/images/tumbler_gold_1790707236688.jpg';
import silverImage from '../assets/images/tumbler_silver_1790707250234.jpg';
import { Product, StoreSettings } from '../types';

export const ASSETS = {
  hero: heroImage,
  matteBlack: matteBlackImage,
  gold: goldImage,
  silver: silverImage,
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'HYDROVA',
  contactEmail: 'hanzalafaheem85@gmail.com',
  whatsappNumber: '+923069614050',
  currency: 'PKR',
  shippingCharges: 250,
  freeShippingThreshold: 5000,
  announcementText: '🌟 Nationwide Cash on Delivery (COD) Available Across Pakistan | Free Shipping on Orders Over Rs. 5,000',
  returnPolicy: 'We offer a 7-day hassle-free replacement warranty for any manufacturing defect or transit damage. Simply contact our support on WhatsApp (+923069614050) with unboxing photos or video.',
  shippingPolicy: 'Standard delivery via leading couriers (TCS / Leopards / Call Courier) takes 2 to 4 business days. All orders are processed with Cash on Delivery (COD). You inspect the package upon courier arrival and pay cash.',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'hydrova-stainless-steel-tumbler',
    name: 'HYDROVA Stainless Steel Tumbler',
    description: 'Engineered for all-day temperature defense. Features premium food-grade 18/8 stainless steel, double-wall vacuum insulation, ergonomic comfort-grip handle, a 3-position splash-resistant lid, and reusable matching straw. Fits comfortably in standard vehicle cup holders.',
    price: 3500,
    compareAtPrice: 4500,
    images: [matteBlackImage, goldImage, silverImage],
    colors: ['Matte Obsidian Black', 'Champagne Gold', 'Brushed Stainless Silver'],
    stock: 24,
    active: true,
    featured: true,
    category: 'Tumblers',
    capacity: '40 oz (1,180 ml)',
    material: 'Pro-grade 18/8 Double-Wall Stainless Steel, BPA-free',
    temperatureRetention: '24 Hours Cold / 12 Hours Hot',
  },
  {
    id: 'hydrova-gold-edition-tumbler',
    name: 'HYDROVA Prestige Gold Edition Tumbler',
    description: 'An elevated satin-gold aesthetic coupled with high-efficiency vacuum chamber insulation. Includes silicone seal leak-resistant lid and ergonomic handle.',
    price: 3500,
    compareAtPrice: 4500,
    images: [goldImage, matteBlackImage],
    colors: ['Champagne Gold', 'Matte Obsidian Black'],
    stock: 18,
    active: true,
    featured: true,
    category: 'Tumblers',
    capacity: '40 oz (1,180 ml)',
    material: 'Pro-grade 18/8 Double-Wall Stainless Steel, BPA-free',
    temperatureRetention: '24 Hours Cold / 12 Hours Hot',
  },
  {
    id: 'hydrova-silver-travel-tumbler',
    name: 'HYDROVA Classic Silver Tumbler',
    description: 'The everyday companion for city commutes and desk hydration. Double-wall stainless steel vacuum insulation keeps iced drinks frosty through long workdays.',
    price: 3500,
    compareAtPrice: 4200,
    images: [silverImage, matteBlackImage],
    colors: ['Brushed Stainless Silver', 'Matte Obsidian Black'],
    stock: 15,
    active: true,
    featured: true,
    category: 'Tumblers',
    capacity: '30 oz (890 ml)',
    material: 'Pro-grade 18/8 Double-Wall Stainless Steel, BPA-free',
    temperatureRetention: '20 Hours Cold / 10 Hours Hot',
  }
];
