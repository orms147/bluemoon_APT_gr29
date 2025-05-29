"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store" 
import { apiClient } from "@/lib/api-client"
import { UPDATE_USER_INFO_ROUTE, CHANGE_PASSWORD_ROUTE } from "@/utils/constant"

export function CaiDatPage() {
  const {userInfo, setUserInfo} = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  
  const [user, setUser] = useState({
    fullname: userInfo?.fullname,
    username: userInfo?.username,
    email: userInfo?.email,
    phone: userInfo?.phone
  })

  // ✅ Thêm state cho form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ✅ Thêm handler cho form đổi mật khẩu
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    
    try {
      const response = await apiClient.put(
        `${UPDATE_USER_INFO_ROUTE}`,
        {
          fullname: user.fullname,
          email: user.email,
          phone: user.phone
        },
        {withCredentials: true}
      )
      
      if (response.status === 200) {
        setUserInfo(response.data)
        setMessage("Cập nhật thông tin thành công!")
      }
    } catch (error: any) {
      console.log(error);
      setMessage(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Thêm handler submit cho đổi mật khẩu
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPasswordLoading(true)
    setPasswordMessage("")
    
    try {
      const response = await apiClient.put(
        `${CHANGE_PASSWORD_ROUTE}`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        },
        {withCredentials: true}
  )
      
      if (response.status === 200) {
        setPasswordMessage("Đổi mật khẩu thành công!")
        // Reset form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
}
    } catch (error: any) {
      console.log(error);
      setPasswordMessage(error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu.")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Cài đặt</h2>
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUserInfoSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                    <AvatarFallback>QT</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Thay đổi ảnh
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Họ tên</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={user.fullname}
                      onChange={handleUserInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input
                      id="username"
                      name="username"
                      value={user.username}
                      onChange={handleUserInfoChange}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={handleUserInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={user.phone}
                      onChange={handleUserInfoChange}
                    />
                  </div>
                </div>
                {/* ✅ Thêm thông báo cho cập nhật thông tin */}
                {message && (
                  <div className={`text-sm ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu của bạn
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required 
                  />
                </div>
                {/* ✅ Thêm thông báo cho đổi mật khẩu */}
                {passwordMessage && (
                  <div className={`text-sm ${passwordMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMessage}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}