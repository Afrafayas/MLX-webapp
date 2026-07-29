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
  joinedDate: string;
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
  specs: Record<string, string>;
  images?: string[];
}

export interface SourcingToast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export interface ReduxState {
  auth: {
    activeShop: Shop | null;
    showAuthModal: boolean;
    authTab: 'login' | 'register';
  };
  products: {
    items: Product[];
    shops: Shop[];
    selectedProduct: Product | null;
    showAddEditModal: boolean;
    productToEdit: Product | null;
  };
  filters: {
    searchQuery: string;
    searchCategory: string;
    selectedCategory: string;
    filterBrand: string;
    filterMinPrice: string;
    filterMaxPrice: string;
    filterInStockOnly: boolean;
    sortBy: 'featured' | 'price-asc' | 'price-desc' | 'stock';
  };
  ui: {
    toasts: SourcingToast[];
    activeView: 'marketplace' | 'dashboard';
    dashboardTab: 'listings' | 'profile';
  };
}
