import { MaterialProduct, MaterialFilterState, MaterialCategory, MaterialOrder, MaterialImportRow } from '../types/materialTypes';
import { MATERIALS_MODULE_CONFIG } from '../config/moduleConfig';

/**
 * Dedicated API Client for Lab Materials & Hardware Kits Module
 * 
 * Communicates with /api/materials or separate subdomain/microservice.
 */
class MaterialsApiClient {
  private baseUrl = MATERIALS_MODULE_CONFIG.apiBaseUrl;

  public async fetchMaterials(filter?: Partial<MaterialFilterState>): Promise<{ items: MaterialProduct[]; total: number; categories: MaterialCategory[] }> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.set('q', filter.searchQuery);
    if (filter?.selectedCategories && filter.selectedCategories.length > 0) {
      params.set('categories', filter.selectedCategories.join(','));
    }
    if (filter?.minPrice) params.set('minPrice', filter.minPrice.toString());
    if (filter?.maxPrice) params.set('maxPrice', filter.maxPrice.toString());
    if (filter?.stockStatus) params.set('stockStatus', filter.stockStatus);
    if (filter?.sortBy) params.set('sortBy', filter.sortBy);

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
    const data = await res.json();
    return { items: data.data || [], total: data.total || 0, categories: data.categories || [] };
  }

  public async getProductById(id: string): Promise<MaterialProduct> {
    const res = await fetch(`${this.baseUrl}/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Product not found');
    const json = await res.json();
    return json.data;
  }

  public async createProduct(product: Partial<MaterialProduct>): Promise<MaterialProduct> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    const json = await res.json();
    return json.data;
  }

  public async updateProduct(id: string, updates: Partial<MaterialProduct>): Promise<MaterialProduct> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    const json = await res.json();
    return json.data;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    }
    return true;
  }

  public async importProducts(items: MaterialImportRow[] | Partial<MaterialProduct>[]): Promise<number> {
    const res = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to import products');
    }
    const json = await res.json();
    return json.importedCount || 0;
  }

  public async createOrder(orderPayload: any): Promise<MaterialOrder> {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    const json = await res.json();
    return json.data;
  }

  public async trackOrder(orderId: string): Promise<MaterialOrder> {
    const res = await fetch(`${this.baseUrl}/orders?id=${orderId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Order not found');
    const json = await res.json();
    return json.data;
  }

  public getExportUrl(): string {
    return `${this.baseUrl}/export`;
  }
}

export const materialsApi = new MaterialsApiClient();
