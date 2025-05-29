import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserInfo {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "user";
  avatar?: string | null;
}

export interface AppStore {
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

// 3. Khởi tạo store
const store = (set: any, get: any): AppStore => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => {
    set({ userInfo });
  },
  clearUserInfo: () => {
    set({ userInfo: undefined });
  },
});

// 4. Tạo hook Zustand có persist và devtools
export const useAppStore = create<AppStore>()(
  devtools(
    persist(store, {
      name: "user-storage", // key trong localStorage
      partialize: (state) => ({ userInfo: state.userInfo }), // chỉ persist userInfo
    })
  )
);

