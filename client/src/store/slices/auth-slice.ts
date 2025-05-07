import { StateCreator } from 'zustand';

export interface UserInfo {
  id: string;
  username: string;
  fullname: string;
  role: string;
  avatar: string;
}

export interface AuthSlice {
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [],
  AuthSlice
> = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
