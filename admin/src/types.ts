export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  category: string;
  verified: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  products?: Product[];
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  shopId: string;
  specs?: Record<string, string>;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalShops: number;
  verifiedShops: number;
  pendingShops: number;
  totalProducts: number;
  totalLeads: number;
  totalUsers: number;
}
