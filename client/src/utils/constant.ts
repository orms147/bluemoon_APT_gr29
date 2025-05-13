export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTES}/user-info`;

export const HOKHAU_ROUTES = "api/ho-khau";
export const GET_HOKHAU_BY_ID_ROUTE = `${HOKHAU_ROUTES}`;
export const GET_ALL_HOKHAU_ROUTE = `${HOKHAU_ROUTES}/danh-sach-ho-khau`;
export const ADD_HOKHAU_ROUTE = `${HOKHAU_ROUTES}/them-ho-khau`;
export const DELETE_HOKHAU_ROUTE = `${HOKHAU_ROUTES}/xoa-ho-khau`;

export const NHANKHAU_ROUTES = "api/nhan-khau";
export const GET_ALL_NHANKHAU_ROUTE = `${NHANKHAU_ROUTES}/danh-sach-nhan-khau`;
export const ADD_NHANKHAU_ROUTE = `${NHANKHAU_ROUTES}/them-nhan-khau`;
export const PUT_NHANKHAU_ROUTE = `${NHANKHAU_ROUTES}/cap-nhat-nhan-khau`;
export const DELETE_NHANKHAU_ROUTE =  `${NHANKHAU_ROUTES}/xoa-nhan-khau`;

export const KHOANTHU_ROUTES = "api/khoan-thu";
export const GET_ALL_KHOANTHU_ROUTE = `${KHOANTHU_ROUTES}/danh-sach-khoan-thu`;
export const ADD_KHOANTHU_ROUTE = `${KHOANTHU_ROUTES}/them-khoan-thu`;
export const PUT_KHOANTHU_ROUTE = `${KHOANTHU_ROUTES}/cap-nhat-khoan-thu`;
export const DELETE_KHOANTHU_ROUTE = `${KHOANTHU_ROUTES}/xoa-khoan-thu`;

export const PHIEUNOP_ROUTES = "api/phieu-nop";
export const GET_ALL_PHIEUNOP_ROUTE = `${PHIEUNOP_ROUTES}/danh-sach-phieu-nop`;
export const ADD_PHIEUNOP_ROUTE = `${PHIEUNOP_ROUTES}/them-phieu-nop`;
export const PUT_PHIEUNOP_ROUTE = `${PHIEUNOP_ROUTES}/cap-nhat-phieu-nop`;
export const DELETE_PHIEUNOP_ROUTE = `${PHIEUNOP_ROUTES}/xoa-phieu-nop`;