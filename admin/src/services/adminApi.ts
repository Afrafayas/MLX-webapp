import { Shop, AdminStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE_URL}/shops/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin statistics');
  const result = await res.json();
  return result.data?.stats ?? {
    totalShops: 0,
    verifiedShops: 0,
    pendingShops: 0,
    totalProducts: 0,
    totalLeads: 0,
    totalUsers: 0,
  };
}

export async function fetchShops(params?: {
  city?: string;
  category?: string;
  search?: string;
}): Promise<Shop[]> {
  const query = new URLSearchParams();
  if (params?.city) query.append('city', params.city);
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE_URL}/shops?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch shops');
  const result = await res.json();
  return result.data?.shops ?? [];
}

export async function fetchShopById(id: string): Promise<Shop> {
  const res = await fetch(`${API_BASE_URL}/shops/${id}`);
  if (!res.ok) throw new Error('Failed to fetch shop details');
  const result = await res.json();
  return result.data?.shop ?? result;
}

export async function toggleVerifyShop(id: string, verified?: boolean): Promise<Shop> {
  const res = await fetch(`${API_BASE_URL}/shops/${id}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verified }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to toggle shop verification');
  return result.data?.shop ?? result;
}

export async function updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
  const res = await fetch(`${API_BASE_URL}/shops/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shopData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to update shop details');
  return result.data?.shop ?? result;
}

export async function deleteShop(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/shops/${id}`, {
    method: 'DELETE',
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to delete shop');
  return result;
}
