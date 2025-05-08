export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const HOKHAU_ROUTES = "api/ho-khau";
export const GET_ALL_HOKHAU_ROUTE = `${HOKHAU_ROUTES}/danh-sach-ho-khau`;
export const ADD_HOKHAU_ROUTE = `${HOKHAU_ROUTES}/them-ho-khau`;
