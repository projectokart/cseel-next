import { MaterialProduct, MaterialFilterState } from '../types/materialTypes';
import { INITIAL_MATERIAL_PRODUCTS } from './seedData';
import { slugify } from '@/lib/utils';
import { departmentDb } from '@/lib/database/departmentDbAdapter';

/**
 * Pluggable Database Repository for Lab Materials & Hardware Kits
 * 
 * Connected to Supabase Schema Folder: materials.products
 * Supports dynamic switching to external database (MATERIALS_DATABASE_URL).
 */
class MaterialsRepository {
  private products: MaterialProduct[] = [...INITIAL_MATERIAL_PRODUCTS];

  constructor() {
    this.products = [...INITIAL_MATERIAL_PRODUCTS];
  }

  public async getAll(filter?: Partial<MaterialFilterState>): Promise<{ items: MaterialProduct[]; total: number }> {
    // Attempt DB Fetch (Supabase / External DB), fallback to in-memory
    const { data } = await departmentDb.query<MaterialProduct>('materials', 'products', this.products);
    let result = [...data].filter((p) => p.is_active !== false);

    if (!filter) return { items: result, total: result.length };

    // Search Query
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.scientific_name && p.scientific_name.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.common_names && p.common_names.some((cn) => cn.toLowerCase().includes(q)))
      );
    }

    // Category Filter
    if (filter.selectedCategories && filter.selectedCategories.length > 0) {
      result = result.filter((p) => filter.selectedCategories!.includes(p.category));
    }

    // Price Filter
    if (filter.minPrice !== undefined && filter.minPrice > 0) {
      result = result.filter((p) => p.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined && filter.maxPrice > 0) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    // Stock Status
    if (filter.stockStatus && filter.stockStatus !== 'all') {
      if (filter.stockStatus === 'in_stock') {
        result = result.filter((p) => (p.current_stock ?? p.stock) > 10);
      } else if (filter.stockStatus === 'low_stock') {
        result = result.filter((p) => (p.current_stock ?? p.stock) > 0 && (p.current_stock ?? p.stock) <= 10);
      } else if (filter.stockStatus === 'out_of_stock') {
        result = result.filter((p) => (p.current_stock ?? p.stock) <= 0);
      }
    }

    // Sort By
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
          break;
        case 'popular':
        default:
          result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
          break;
      }
    }

    return { items: result, total: result.length };
  }

  public async getById(id: string): Promise<MaterialProduct | null> {
    const { data } = await departmentDb.query<MaterialProduct>('materials', 'products', this.products, {
      match: { id },
    });
    const found = data.find((p) => p.id === id || p.slug === id);
    return found ? { ...found } : null;
  }

  public async getBySlug(slug: string): Promise<MaterialProduct | null> {
    const { data } = await departmentDb.query<MaterialProduct>('materials', 'products', this.products, {
      match: { slug },
    });
    const found = data.find((p) => p.slug === slug || p.id === slug);
    return found ? { ...found } : null;
  }

  public async create(productData: Partial<MaterialProduct>): Promise<MaterialProduct> {
    const id = `mat-${Date.now()}`;
    const slug = slugify(productData.name || `product-${id}`);
    const sku = productData.sku || `CSEEL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct: MaterialProduct = {
      id,
      slug,
      sku,
      name: productData.name || 'New Lab Equipment',
      scientific_name: productData.scientific_name,
      common_names: productData.common_names || [],
      category: productData.category || 'biology',
      category_label: productData.category_label || 'Lab Equipment',
      brand: productData.brand || 'CSEEL Scientific',
      price: productData.price || 999,
      original_price: productData.original_price || (productData.price ? productData.price * 1.25 : 1299),
      discount_percentage: productData.discount_percentage || 20,
      rating: 5.0,
      reviews: 1,
      stock: productData.stock || 50,
      current_stock: productData.current_stock || productData.stock || 50,
      min_order_qty: productData.min_order_qty || 1,
      image_url: productData.image_url || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      gallery: productData.gallery || [productData.image_url || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'],
      tag: productData.tag || 'Standard Specification',
      description: productData.description || 'Certified laboratory grade equipment.',
      specification: productData.specification || 'Standard laboratory grade',
      includes: productData.includes || ['Instruction Manual', 'Calibration Certificate'],
      safety: productData.safety || 'Wear standard PPE.',
      warning: productData.warning || 'Handle with care.',
      handling: productData.handling || 'Clean with deionized water.',
      storage: productData.storage || 'Store in cool, dry place.',
      warranty: productData.warranty || '1 Year Standard Warranty',
      delivery_days: productData.delivery_days || 3,
      featured: Boolean(productData.featured),
      is_active: true,
    };

    // Insert into DB if live
    await departmentDb.insert('materials', 'products', newProduct);

    // Save in local repository
    this.products.unshift(newProduct);
    return newProduct;
  }

  public async update(id: string, updates: Partial<MaterialProduct>): Promise<MaterialProduct | null> {
    await departmentDb.update('materials', 'products', id, updates);

    const index = this.products.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;
    const updated = { ...this.products[index], ...updates };
    this.products[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await departmentDb.delete('materials', 'products', id);

    const index = this.products.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<MaterialProduct>[]): Promise<MaterialProduct[]> {
    const created: MaterialProduct[] = [];
    for (const item of items) {
      if (item.name) {
        const c = await this.create(item);
        created.push(c);
      }
    }
    return created;
  }
}

export const materialsRepository = new MaterialsRepository();
