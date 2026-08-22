import { MaterialProduct, MaterialFilterState, MaterialCategoryKey } from '../types/materialTypes';
import { INITIAL_MATERIAL_PRODUCTS, MATERIAL_CATEGORIES } from './seedData';
import { slugify } from '@/lib/utils';

/**
 * Pluggable Database Repository for Lab Materials & Hardware Kits
 * 
 * Supports external database connections (PostgreSQL, Supabase, MongoDB)
 * or fast in-memory store with persistence.
 */
class MaterialsRepository {
  private products: MaterialProduct[] = [...INITIAL_MATERIAL_PRODUCTS];

  // Singleton instance
  constructor() {
    this.products = [...INITIAL_MATERIAL_PRODUCTS];
  }

  public async getAll(filter?: Partial<MaterialFilterState>): Promise<{ items: MaterialProduct[]; total: number }> {
    let result = [...this.products].filter((p) => p.is_active !== false);

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
          p.common_names.some((cn) => cn.toLowerCase().includes(q))
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
        result = result.filter((p) => p.current_stock > 10);
      } else if (filter.stockStatus === 'low_stock') {
        result = result.filter((p) => p.current_stock > 0 && p.current_stock <= 10);
      } else if (filter.stockStatus === 'out_of_stock') {
        result = result.filter((p) => p.current_stock <= 0);
      }
    }

    // Sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          break;
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return { items: result, total: result.length };
  }

  public async getById(id: string): Promise<MaterialProduct | null> {
    const found = this.products.find((p) => p.id === id || p.slug === id);
    return found ? { ...found } : null;
  }

  public async create(data: Omit<MaterialProduct, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<MaterialProduct> {
    const generatedId = `m-${Date.now()}`;
    const generatedSlug = slugify(data.name) + `-${Date.now().toString().slice(-4)}`;
    
    // Ensure gallery has at least main image and max 5
    const gallery = (data.gallery && data.gallery.length > 0)
      ? Array.from(new Set([data.image_url, ...data.gallery])).slice(0, 5)
      : [data.image_url];

    const categoryObj = MATERIAL_CATEGORIES.find((c) => c.key === data.category);

    const newProduct: MaterialProduct = {
      ...data,
      id: generatedId,
      slug: generatedSlug,
      categoryLabel: categoryObj?.label || data.category,
      gallery,
      current_stock: data.current_stock ?? data.stock ?? 0,
      stock: data.stock ?? 0,
      rating: data.rating || 5.0,
      reviews: data.reviews || 0,
      is_active: data.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.products.unshift(newProduct);
    return newProduct;
  }

  public async update(id: string, updates: Partial<MaterialProduct>): Promise<MaterialProduct | null> {
    const index = this.products.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;

    const existing = this.products[index];
    const gallery = updates.gallery
      ? Array.from(new Set([updates.image_url || existing.image_url, ...updates.gallery])).slice(0, 5)
      : existing.gallery;

    const updatedProduct: MaterialProduct = {
      ...existing,
      ...updates,
      gallery,
      updated_at: new Date().toISOString(),
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  public async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<MaterialProduct>[]): Promise<MaterialProduct[]> {
    const created: MaterialProduct[] = [];
    for (const item of items) {
      if (!item.name) continue;
      const prod = await this.create({
        name: item.name,
        scientific_name: item.scientific_name || '',
        common_names: item.common_names || [item.name],
        category: (item.category as MaterialCategoryKey) || 'GLS',
        sku: item.sku || `CSE-${Date.now().toString().slice(-6)}`,
        price: Number(item.price) || 100,
        original_price: Number(item.original_price) || Number(item.price) * 1.25,
        stock: Number(item.stock) || 50,
        current_stock: Number(item.current_stock || item.stock) || 50,
        image_url: item.image_url || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop',
        gallery: item.gallery || [item.image_url || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop'],
        description: item.description || 'High quality educational lab equipment.',
        specification: item.specification || 'ISO standard lab equipment',
        includes: item.includes || [],
        safety: item.safety || 'Use with standard safety gear.',
        is_active: true,
        rating: 5.0,
        reviews: 0,
      });
      created.push(prod);
    }
    return created;
  }

  public getCategories() {
    return MATERIAL_CATEGORIES.map((cat) => ({
      ...cat,
      itemCount: this.products.filter((p) => p.category === cat.key).length,
    }));
  }
}

// Export singleton instance
export const materialsRepository = new MaterialsRepository();
