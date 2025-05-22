"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { LOGIN_ROUTE } from "@/utils/constant"
import { useAppStore } from "@/store"

export function LoginPage() {
  const navigate = useNavigate()
  const {setUserInfo} = useAppStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateLogin = () => {
    // Bổ sung để kiểm tra đã điền đầy đủ tài khoản, mật khẩu hay chưachưa
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (validateLogin()) {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {username, password},
          {withCredentials: true}
        );
        if (response.data.user.id){
          setUserInfo(response.data.user)
          navigate("/")
        } else {
          alert("Tài khoản hoặc mật khẩu không đúng")
        }
        console.log(response)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
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
          <CardDescription>Phần mềm quản lý thu phí chung cư</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
