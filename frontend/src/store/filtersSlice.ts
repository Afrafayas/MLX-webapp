import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  searchQuery: string;
  searchCategory: string;
  selectedCategory: string;
  filterBrand: string;
  filterMinPrice: string;
  filterMaxPrice: string;
  filterInStockOnly: boolean;
  filterCity: string;
  filterMaxBudget: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'stock';
}

const initialState: FiltersState = {
  searchQuery: '',
  searchCategory: 'All Categories',
  selectedCategory: 'All Categories',
  filterBrand: '',
  filterMinPrice: '',
  filterMaxPrice: '',
  filterInStockOnly: false,
  filterCity: 'All Cities',
  filterMaxBudget: 'Any Budget',
  sortBy: 'featured',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSearchCategory(state, action: PayloadAction<string>) {
      state.searchCategory = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setFilterBrand(state, action: PayloadAction<string>) {
      state.filterBrand = action.payload;
    },
    setFilterMinPrice(state, action: PayloadAction<string>) {
      state.filterMinPrice = action.payload;
    },
    setFilterMaxPrice(state, action: PayloadAction<string>) {
      state.filterMaxPrice = action.payload;
    },
    setFilterInStockOnly(state, action: PayloadAction<boolean>) {
      state.filterInStockOnly = action.payload;
    },
    setFilterCity(state, action: PayloadAction<string>) {
      state.filterCity = action.payload;
    },
    setFilterMaxBudget(state, action: PayloadAction<string>) {
      state.filterMaxBudget = action.payload;
    },
    setSortBy(state, action: PayloadAction<'featured' | 'price-asc' | 'price-desc' | 'stock'>) {
      state.sortBy = action.payload;
    },
    clearFilters(state) {
      state.searchQuery = '';
      state.searchCategory = 'All Categories';
      state.selectedCategory = 'All Categories';
      state.filterBrand = '';
      state.filterMinPrice = '';
      state.filterMaxPrice = '';
      state.filterInStockOnly = false;
      state.filterCity = 'All Cities';
      state.filterMaxBudget = 'Any Budget';
      state.sortBy = 'featured';
    },
  },
});

export const {
  setSearchQuery,
  setSearchCategory,
  setSelectedCategory,
  setFilterBrand,
  setFilterMinPrice,
  setFilterMaxPrice,
  setFilterInStockOnly,
  setFilterCity,
  setFilterMaxBudget,
  setSortBy,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
