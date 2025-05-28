import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Home, CreditCard, TrendingUp } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { GET_ALL_HOKHAU_ROUTE, GET_ALL_NHANKHAU_ROUTE, GET_ALL_KHOANTHU_ROUTE, GET_ALL_PHIEUNOP_ROUTE, GET_RECENT_ACTIVITY_ROUTE } from "@/utils/constant"
import { HoKhau, NhanKhau, KhoanThu, PhieuNopTien, Activity } from '@/types'

export function DashboardPage() {
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([])
  const [phieuNopList, setPhieuNopList] = useState<PhieuNopTien[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [getListHoKhau, getListNhanKhau, getListKhoanThu, getListPhieuNop, getRecentActivities] = await Promise.all([
          apiClient.get(GET_ALL_HOKHAU_ROUTE, {withCredentials: true}),
          apiClient.get(GET_ALL_NHANKHAU_ROUTE, {withCredentials: true}),
          apiClient.get(GET_ALL_KHOANTHU_ROUTE, {withCredentials: true}),
          apiClient.get(GET_ALL_PHIEUNOP_ROUTE, {withCredentials: true}),
          apiClient.get(GET_RECENT_ACTIVITY_ROUTE, {withCredentials: true})
        ])
        setHoKhauList(getListHoKhau.data)
        setNhanKhauList(getListNhanKhau.data)
        setKhoanThuList(getListKhoanThu.data)
        setPhieuNopList(getListPhieuNop.data)
        setRecentActivities(getRecentActivities.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  },[])
  const tongThu = (phieuNopList.reduce((sum, item) => sum + item.soTien, 0) / 1000000).toString()
  // Mock data for dashboard
  const stats = [
    {
      title: "Tổng số hộ khẩu",
      value: hoKhauList.length,
      description: "Hộ gia đình",
      icon: Home,
      color: "bg-blue-500",
    },
    {
      title: "Tổng số nhân khẩu",
      value: nhanKhauList.length,
      description: "Cư dân",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Khoản thu hiện tại",
      value: khoanThuList.length,
      description: "Đang thu",
      icon: CreditCard,
      color: "bg-orange-500",
    },
    {
      title: "Tổng thu tháng này",
      value: tongThu + 'M',
      description: "VND",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} rounded-full p-2 text-white`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>5 hoạt động gần nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.content}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString("vi-VN", {
                                                                                                                                    day: "2-digit",
                                                                                                                                    month: "2-digit",
                                                                                                                                    year: "numeric",
                                                                                                                                  })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tình hình thu phí</CardTitle>
            <CardDescription>Tỷ lệ thu phí trong tháng hiện tại</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">78%</div>
              <p className="mt-2 text-sm text-muted-foreground">Đã thu: 96/124 hộ gia đình</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
