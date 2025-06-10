import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "./ui/sidebar"
import { Header } from "./ui/header"

export function Layout() {
  const location = useLocation()

  // Map routes to titles
  const getTitleFromPath = (path: string) => {
    const titles: Record<string, string> = {
      "/": "Trang chủ",
      "/ho-khau": "Quản lý Hộ khẩu",
      "/nhan-khau": "Quản lý Nhân khẩu",
      "/khoan-thu": "Quản lý Khoản thu",
      "/thu-phi": "Quản lý Thu phí",
      "/phuong-tien": "Quản lý Phương tiện",
      "/phi-gui-xe": "Quản lý Phí gửi xe",
      "/tam-tru-tam-vang": "Quản lý Tạm trú/Tạm vắng",
      "/thong-ke": "Thống kê",
      "/cai-dat": "Cài đặt",
    }

    return titles[path] || "BlueMoon"
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={getTitleFromPath(location.pathname)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
