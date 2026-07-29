import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop } from '../types';

interface AuthState {
  activeShop: Shop | null;
  showAuthModal: boolean;
  authTab: 'login' | 'register';
}

const getInitialActiveShop = (): Shop | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mlx_active_shop');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

const initialState: AuthState = {
  activeShop: getInitialActiveShop(),
  showAuthModal: false,
  authTab: 'login',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setActiveShop(state, action: PayloadAction<Shop | null>) {
      state.activeShop = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('mlx_active_shop', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('mlx_active_shop');
        }
      }
    },
    setShowAuthModal(state, action: PayloadAction<boolean>) {
      state.showAuthModal = action.payload;
    },
    setAuthTab(state, action: PayloadAction<'login' | 'register'>) {
      state.authTab = action.payload;
    },
  },
});

export const { setActiveShop, setShowAuthModal, setAuthTab } = authSlice.actions;
export default authSlice.reducer;
