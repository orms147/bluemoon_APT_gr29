import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Home, CreditCard, TrendingUp, Plus } from "lucide-react"

export function DashboardPage() {
  // Mock data for dashboard
  const stats = [
    {
      title: "Tổng số hộ khẩu",
      value: "124",
      description: "Hộ gia đình",
      icon: Home,
      color: "bg-blue-500",
    },
    {
      title: "Tổng số nhân khẩu",
      value: "432",
      description: "Cư dân",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Khoản thu hiện tại",
      value: "8",
      description: "Đang thu",
      icon: CreditCard,
      color: "bg-orange-500",
    },
    {
      title: "Tổng thu tháng này",
      value: "42.5M",
      description: "VND",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ]

  // Recent activities
  const recentActivities = [
    {
      id: "1",
      action: "Nộp phí dịch vụ",
      user: "Nguyễn Văn A",
      amount: "1,200,000 VND",
      time: "Hôm nay, 10:30",
    },
    {
      id: "2",
      action: "Đăng ký tạm vắng",
      user: "Trần Thị B",
      time: "Hôm nay, 09:15",
    },
    {
      id: "3",
      action: "Thêm hộ khẩu mới",
      user: "Admin",
      time: "Hôm qua, 15:45",
    },
    {
      id: "4",
      action: "Nộp phí gửi xe",
      user: "Lê Văn C",
      amount: "200,000 VND",
      time: "Hôm qua, 14:20",
    },
    {
      id: "5",
      action: "Cập nhật thông tin nhân khẩu",
      user: "Admin",
      time: "Hôm qua, 11:30",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo khoản thu
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Ghi nhận nộp tiền
          </Button>
        </div>
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
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user} {activity.amount && `- ${activity.amount}`}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
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
