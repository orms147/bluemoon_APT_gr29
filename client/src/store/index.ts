import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/auth-slice';

type AppState = AuthSlice;

export const useAppStore = create<AppState>()((...args) => ({
  ...createAuthSlice(...args),
}));