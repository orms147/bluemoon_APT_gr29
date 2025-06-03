"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { REGISTER_ROUTE } from "@/utils/constant"
import { useAppStore } from "@/store"

export function RegisterPage() {
  const navigate = useNavigate()
  const { setUserInfo } = useAppStore()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    email: "",
    phone: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.fullname) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return false
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await apiClient.post(
        REGISTER_ROUTE,
        {
          username: formData.username,
          password: formData.password,
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone
        },
        { withCredentials: true }
      )
      
      if (response.data.user.id) {
        setUserInfo(response.data.user)
        navigate("/")
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">BlueMoon</CardTitle>
          <CardDescription>Đăng ký tài khoản mới</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                Tên đăng nhập <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullname">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Nhập họ và tên"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 