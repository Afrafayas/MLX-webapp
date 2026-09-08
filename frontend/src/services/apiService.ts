import { API_BASE_URL } from '../config/api';
import { Product, Shop, Lead, Category, Brand } from '../types';

export async function getProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  city?: string;
  sortBy?: string;
  shopId?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category && params.category !== 'all') query.append('category', params.category);
  if (params?.brand && params.brand !== 'all') query.append('brand', params.brand);
  if (params?.minPrice) query.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
  if (params?.city) query.append('city', params.city);
  if (params?.sortBy) query.append('sortBy', params.sortBy);
  if (params?.shopId) query.append('shopId', params.shopId);

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getShops(): Promise<Shop[]> {
  const res = await fetch(`${API_BASE_URL}/shops`);
  if (!res.ok) throw new Error('Failed to fetch shops');
  return res.json();
}

/* Category CRUD APIs */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data: { name: string; slug?: string; image?: string }, token: string): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to create category');
  return result;
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; image?: string }, token: string): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to update category');
  return result;
}

export async function deleteCategory(id: string, token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to delete category');
  return result;
}

/* Brand CRUD APIs */
export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`${API_BASE_URL}/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function createBrand(data: { name: string; logo?: string }, token: string): Promise<Brand> {
  const res = await fetch(`${API_BASE_URL}/brands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to create brand');
  return result;
}

export async function updateBrand(id: string, data: { name?: string; logo?: string }, token: string): Promise<Brand> {
  const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to update brand');
  return result;
}

export async function deleteBrand(id: string, token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to delete brand');
  return result;
}

/* Auth APIs */
export async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerUser(userData: {
  email?: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
  shopName?: string;
  ownerName?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  category?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Registration failed');
  }
  return data;
}

export async function sendLead(leadData: {
  shopId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  contactType: 'call' | 'whatsapp';
}) {
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit inquiry');
  return data;
}

export async function getSellerLeads(token: string): Promise<Lead[]> {
  const res = await fetch(`${API_BASE_URL}/leads/seller`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch seller leads');
  return res.json();
}

export async function getSellerProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch shop products');
  return res.json();
}

export async function createSellerProduct(
  productData: {
    name: string;
    brand: string;
    category: string;
    description: string;
    price: number;
    stock?: number;
    specs?: Record<string, string>;
    images?: string[];
  },
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to create product listing');
  }
  return data;
}

export async function deleteSellerProduct(productId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete product listing');
  return data;
}
