/**
 * Lab Materials & Kits: Comprehensive Type System
 */

export type MaterialCategoryKey = 
  | 'GLS' // Glassware
  | 'CHM' // Chemical Reagents
  | 'KIT' // STEM & Robotics Kits
  | 'SNS' // Sensors & Microcontrollers
  | 'INS' // Laboratory Instruments
  | 'OPT' // Optics & Lasers
  | 'BIO' // Biology & Specimens
  | 'ELC' // Electronics & Components;

export interface MaterialCategory {
  key: MaterialCategoryKey;
  label: string;
  description: string;
  iconName?: string;
  badgeColor: string;
  itemCount?: number;
}

export interface MaterialReview {
  id: string;
  userId: string;
  userName: string;
  userRole?: 'Teacher' | 'Student' | 'Lab Assistant' | 'Institutional Buyer';
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  likesCount: number;
}

export interface MaterialProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  scientific_name?: string;
  common_names: string[];
  category: MaterialCategoryKey;
  categoryLabel?: string;
  brand?: string;
  price: number;
  original_price: number;
  discountPercentage?: number;
  rating: number;
  reviews: number;
  stock: number;
  current_stock: number;
  min_order_qty?: number;
  image_url: string;
  gallery: string[]; // Up to 5 images
  tag?: string; // e.g. "Bestseller", "15% OFF", "NEP-2020 Recommended"
  description: string;
  specification: string;
  includes: string[];
  safety: string;
  warning?: string;
  handling?: string;
  storage?: string;
  grade?: string;
  purity?: string;
  cas_number?: string;
  hsn_code?: string;
  warranty?: string;
  delivery_days?: number;
  featured?: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  customerReviews?: MaterialReview[];
}

export interface CartItem {
  product: MaterialProduct;
  quantity: number;
  selectedOption?: string;
}

export interface OrderShippingAddress {
  fullName: string;
  schoolOrOrgName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  gstNumber?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'dispatched' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  date: string;
  completed: boolean;
  location?: string;
}

export interface MaterialOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  shippingAddress: OrderShippingAddress;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingHistory: TrackingStep[];
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Institutional PO' | 'COD';
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export interface MaterialFilterState {
  searchQuery: string;
  selectedCategories: MaterialCategoryKey[];
  minPrice: number;
  maxPrice: number;
  stockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  minRating: number;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface MaterialImportRow {
  name: string;
  category: string;
  price: string | number;
  original_price?: string | number;
  stock: string | number;
  sku?: string;
  description: string;
  image_url: string;
  gallery?: string; // Comma separated URLs
  specification?: string;
  includes?: string; // Semicolon separated
  safety?: string;
}
