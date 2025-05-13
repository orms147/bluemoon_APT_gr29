// User types
export interface User {
    id: string
    username: string
    fullName: string
    role: "admin" | "staff"
    avatar?: string
  }
  
  // Household types
  export interface HoKhau {
    id: string
    maHoKhau: string
    tenChuHo: string
    diaChi: string
    soThanhVien: number
    ngayLap: string
  }
  
  // Resident types
  export interface NhanKhau {
    id: string
    maNhanKhau: string
    hoTen: string
    ngaySinh: string
    gioiTinh: "Nam" | "Nữ" | "Khác"
    cccd: string
    hoKhauId?: string
    danToc?: string
    tonGiao?: string
    ngheNghiep?: string
    noiLamViec?: string
    quanHe?: string
  }
  
  // Fee types
  export interface KhoanThu {
    id: string
    maKhoanThu: string
    tenKhoanThu: string
    loai: "Bắt buộc" | "Tự nguyện"
    soTien?: number
    ghiChu?: string
    ngayTao: string
  }
  
  // Payment types
  export interface PhieuNopTien {
    id: string
    maPhieu: string
    maKhoanThu: string
    maHoKhau: string
    nguoiNop: string
    soTien: number
    ngayNop: string
    nguoiThu: string
    ghiChu?: string
  }
  
  // Temporary residence/absence types
  export interface TamTruTamVang {
    id: string
    maDangKy: string
    nhanKhauId: string
    loai: "Tạm trú" | "Tạm vắng"
    tuNgay: string
    denNgay: string
    diaChi: string
    lyDo: string
  }





  