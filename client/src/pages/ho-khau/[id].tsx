"use client"

import * as React from "react"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronLeft, UserPlus, UserMinus } from "lucide-react"
import type { HoKhau, NhanKhau } from "@/types"
import { apiClient } from "@/lib/api-client"
import { ADD_TO_HOKHAU_ROUTE, GET_ALL_NHANKHAU_ROUTE, GET_HOKHAU_BY_ID_ROUTE } from "@/utils/constant"

export function HoKhauDetailPage() {
  const { maHoKhau } = useParams<{ maHoKhau: string }>()
  const [hoKhau, setHoKhau] = useState<HoKhau | null>(null)
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [availableNhanKhau, setAvailableNhanKhau] = useState<NhanKhau[]>([])
  const [selectedNhanKhauId, setSelectedNhanKhauId] = useState<string>("")
  const [quanHe, setQuanHe] = useState<string>("")
  const fetchData = async () => {
    if (!maHoKhau) return
    try {
      const [getDetailHk, getListNhanKhauAvailable] = await Promise.all([
        apiClient.get(`${GET_HOKHAU_BY_ID_ROUTE}/${maHoKhau}`, { withCredentials: true }),
        apiClient.get(`${GET_ALL_NHANKHAU_ROUTE}`, { withCredentials: true })
      ])
      const hk = getDetailHk.data
      const listNk = getListNhanKhauAvailable.data as NhanKhau[]
      setHoKhau(hk)
      setNhanKhauList(listNk.filter((nk) => nk.hoKhauId === maHoKhau))
      setAvailableNhanKhau(listNk.filter((nk) => !nk.hoKhauId))
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hộ khẩu: ", error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [maHoKhau])

  const handleAddNhanKhau = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hoKhau) return

    if (nhanKhauList.length >= hoKhau.soThanhVien) {
      alert(`Không thể thêm thành viên. Số thành viên đã đạt giới hạn của hộ khẩu (${hoKhau.soThanhVien} người)!`)
      return
    }


    try {
      const response = await apiClient.put(
        `${ADD_TO_HOKHAU_ROUTE}/${selectedNhanKhauId}`,
        {
          hoKhauId: maHoKhau,
          quanHe: quanHe
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAddDialogOpen(false)
        setSelectedNhanKhauId("")
        setQuanHe("")
        await fetchData()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveNhanKhau = async (maNhanKhau: string) => {
    try {
      const response = await apiClient.put(
        `${ADD_TO_HOKHAU_ROUTE}/${maNhanKhau}`,
        {
          hoKhauId: "",
          quanHe: ""
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAddDialogOpen(false)
        setSelectedNhanKhauId("")
        setQuanHe("")
        await fetchData()
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!hoKhau) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/ho-khau">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Chi tiết Hộ khẩu: {hoKhau.maHoKhau}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hộ khẩu</CardTitle>
            <CardDescription>Chi tiết về hộ khẩu và chủ hộ</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Mã hộ khẩu</dt>
                <dd>{hoKhau.maHoKhau}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Tên chủ hộ</dt>
                <dd>{hoKhau.tenChuHo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Địa chỉ</dt>
                <dd>{hoKhau.diaChi}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Số thành viên</dt>
                <dd>{hoKhau.soThanhVien}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Ngày lập</dt>
                <dd>{new Date(hoKhau.ngayLap).toLocaleDateString("vi-VN")}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Thành viên hộ khẩu</CardTitle>
              <CardDescription>Danh sách nhân khẩu thuộc hộ khẩu này</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Thêm thành viên
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddNhanKhau}>
                  <DialogHeader>
                    <DialogTitle>Thêm thành viên vào hộ khẩu</DialogTitle>
                    <DialogDescription>Chọn nhân khẩu và mối quan hệ với chủ hộ</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nhanKhau" className="text-right">
                        Nhân khẩu
                      </Label>
                      <select
                        id="nhanKhau"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedNhanKhauId}
                        onChange={(e) => setSelectedNhanKhauId(e.target.value)}
                        required
                      >
                        <option value="">Chọn nhân khẩu</option>
                        {availableNhanKhau.map((nk) => (
                          <option key={nk.maNhanKhau} value={nk.maNhanKhau}>
                            {nk.hoTen} - {nk.maNhanKhau}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quanHe" className="text-right">
                        Quan hệ với chủ hộ
                      </Label>
                      <Input
                        id="quanHe"
                        value={quanHe}
                        onChange={(e) => setQuanHe(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Thêm</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã NK</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Quan hệ</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nhanKhauList.length > 0 ? (
                  nhanKhauList.map((nhanKhau) => (
                    <TableRow key={nhanKhau.maNhanKhau}>
                      <TableCell className="font-medium">{nhanKhau.maNhanKhau}</TableCell>
                      <TableCell>{nhanKhau.hoTen}</TableCell>
                      <TableCell>{nhanKhau.quanHe}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveNhanKhau(nhanKhau.maNhanKhau)}
                          disabled={nhanKhau.quanHe === "Chủ hộ"}
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Xóa thành viên</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Không có thành viên nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
