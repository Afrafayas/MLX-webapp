import { API_BASE_URL } from '../config/api';
import { Product, Shop, Lead } from '../types';

export async function getProducts(params?: {
  search?: string;
  category?: string;
  city?: string;
  sortBy?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category && params.category !== 'all') query.append('category', params.category);
  if (params?.city) query.append('city', params.city);
  if (params?.sortBy) query.append('sortBy', params.sortBy);

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getShops(): Promise<Shop[]> {
  const res = await fetch(`${API_BASE_URL}/shops`);
  if (!res.ok) throw new Error('Failed to fetch shops');
  return res.json();
}

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
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
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
