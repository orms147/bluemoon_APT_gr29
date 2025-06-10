import type * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Home, Users, FileText, CreditCard, BarChart3, Map, Settings, LogOut, Car, ParkingCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { LOGOUT_ROUTE } from "@/utils/constant"
import { useAppStore } from "@/store"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUserInfo } = useAppStore()

  const routes = [
    {
      title: "Trang chủ",
      href: "/",
      icon: Home,
    },
    {
      title: "Hộ khẩu",
      href: "/ho-khau",
      icon: Users,
    },
    {
      title: "Nhân khẩu",
      href: "/nhan-khau",
      icon: FileText,
    },
    {
      title: "Khoản thu",
      href: "/khoan-thu",
      icon: CreditCard,
    },
    {
      title: "Thu phí",
      href: "/thu-phi",
      icon: CreditCard,
    },
    {
      title: "Phương tiện",
      href: "/phuong-tien",
      icon: Car,
    },
    {
      title: "Phí gửi xe",
      href: "/phi-gui-xe",
      icon: ParkingCircle,
    },
    {
      title: "Tạm trú/Tạm vắng",
      href: "/tam-tru-tam-vang",
      icon: Map,
    },
    {
      title: "Thống kê",
      href: "/thong-ke",
      icon: BarChart3,
    },
    {
      title: "Cài đặt",
      href: "/cai-dat",
      icon: Settings,
    },
  ]

  const logout = async () => {
    try {
      const res = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true })
      if (res.status == 200) {
        setUserInfo(undefined as any)
        navigate("/login")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r bg-background", className)} {...props}>
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">BlueMoon</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={location.pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-2 px-3",
                location.pathname === route.href ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
              )}
              asChild
            >
              <Link to={route.href}>
                <route.icon className="h-4 w-4" />
                {route.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
