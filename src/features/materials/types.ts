export interface ApparatusItem {
  id: string;
  sku: string;
  scientific_name: string;
  name: string;
  slug: string;
  description: string;
  cbse_chapter: string;
  image_url: string;
  cdn_image_url?: string;
  admin_cost_ref?: number;
}

export type MaterialSortOption = 'default' | 'name-asc' | 'name-desc' | 'sku';

export interface QuotationFormData {
  schoolName: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  quantityRequired?: string;
  notes?: string;
}

export interface RequisitionItemData {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  image_url: string;
  quantity: number;
}
