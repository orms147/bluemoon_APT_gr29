"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Plus, MoreHorizontal, Search } from 'lucide-react'
import type { TamTruTamVang, NhanKhau } from "@/types"

// Mock data
const mockTamTruTamVang: TamTruTamVang[] = [
  {
    id: "1",
    maDangKy: "TT001",
    nhanKhauId: "2",
    loai: "Tạm vắng",
    tuNgay: "2023-05-01",
    denNgay: "2023-06-30",
    diaChi: "Hà Nội",
    lyDo: "Công tác",
  },
  {
    id: "2",
    maDangKy: "TT002",
    nhanKhauId: "5",
    loai: "Tạm trú",
    tuNgay: "2023-04-15",
    denNgay: "2023-07-15",
    diaChi: "P.1201, Tòa A, BlueMoon",
    lyDo: "Thăm người thân",
  },
  {
    id: "3",
    maDangKy: "TT003",
    nhanKhauId: "3",
    loai: "Tạm vắng",
    tuNgay: "2023-06-01",
    denNgay: "2023-09-01",
    diaChi: "Đà Nẵng",
    lyDo: "Du học",
  },
]

// Mock data for NhanKhau
const mockNhanKhau: Record<string, NhanKhau> = {
  "1": {
    id: "1",
    maNhanKhau: "NK001",
    hoTen: "Nguyễn Văn A",
    ngaySinh: "1980-05-15",
    gioiTinh: "Nam",
    cccd: "012345678901",
    hoKhauId: "1",
    quanHe: "Chủ hộ",
  },
  "2": {
    id: "2",
    maNhanKhau: "NK002",
    hoTen: "Nguyễn Thị X",
    ngaySinh: "1985-08-20",
    gioiTinh: "Nữ",
    cccd: "012345678902",
    hoKhauId: "1",
    quanHe: "Vợ",
  },
  "3": {
    id: "3",
    maNhanKhau: "NK003",
    hoTen: "Nguyễn Văn Y",
    ngaySinh: "2010-03-10",
    gioiTinh: "Nam",
    cccd: "012345678903",
    hoKhauId: "1",
    quanHe: "Con",
  },
  "5": {
    id: "5",
    maNhanKhau: "NK005",
    hoTen: "Trần Thị B",
    ngaySinh: "1975-11-30",
    gioiTinh: "Nữ",
    cccd: "012345678905",
    hoKhauId: "2",
    quanHe: "Chủ hộ",
  },
}

export function TamTruTamVangPage() {
  const [tamTruTamVangList] = useState<TamTruTamVang[]>(mockTamTruTamVang)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTamTruTamVang, setNewTamTruTamVang] = useState<Partial<TamTruTamVang>>({
    maDangKy: "",
    nhanKhauId: "",
    loai: "Tạm trú",
    tuNgay: new Date().toISOString().split("T")[0],
    denNgay: "",
    diaChi: "",
    lyDo: "",
  })

  const filteredTamTruTamVang = tamTruTamVangList.filter(
    (tamTruTamVang) =>
      tamTruTamVang.maDangKy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mockNhanKhau[tamTruTamVang.nhanKhauId]?.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      tamTruTamVang.diaChi.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTamTruTamVang((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add the new record to the database
    console.log("New temporary residence/absence:", newTamTruTamVang)
    setIsDialogOpen(false)
    // Reset form
    setNewTamTruTamVang({
      maDangKy: "",
      nhanKhauId: "",
      loai: "Tạm trú",
      tuNgay: new Date().toISOString().split("T")[0],
      denNgay: "",
      diaChi: "",
      lyDo: "",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Tạm trú/Tạm vắng</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đăng ký
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm đăng ký tạm trú/tạm vắng</DialogTitle>
                <DialogDescription>Nhập thông tin đăng ký mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maDangKy" className="text-right">
                    Mã đăng ký
                  </Label>
                  <Input
                    id="maDangKy"
                    name="maDangKy"
                    value={newTamTruTamVang.maDangKy}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nhanKhauId" className="text-right">
                    Nhân khẩu
                  </Label>
                  <select
                    id="nhanKhauId"
                    name="nhanKhauId"
                    value={newTamTruTamVang.nhanKhauId}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn nhân khẩu</option>
                    {Object.values(mockNhanKhau).map((nhanKhau) => (
                      <option key={nhanKhau.id} value={nhanKhau.id}>
                        {nhanKhau.hoTen} - {nhanKhau.maNhanKhau}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loai" className="text-right">
                    Loại
                  </Label>
                  <select
                    id="loai"
                    name="loai"
                    value={newTamTruTamVang.loai}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Tạm trú">Tạm trú</option>
                    <option value="Tạm vắng">Tạm vắng</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tuNgay" className="text-right">
                    Từ ngày
                  </Label>
                  <Input
                    id="tuNgay"
                    name="tuNgay"
                    type="date"
                    value={newTamTruTamVang.tuNgay}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="denNgay" className="text-right">
                    Đến ngày
                  </Label>
                  <Input
                    id="denNgay"
                    name="denNgay"
                    type="date"
                    value={newTamTruTamVang.denNgay}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diaChi" className="text-right">
                    Địa chỉ
                  </Label>
                  <Input
                    id="diaChi"
                    name="diaChi"
                    value={newTamTruTamVang.diaChi}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lyDo" className="text-right">
                    Lý do
                  </Label>
                  <Input
                    id="lyDo"
                    name="lyDo"
                    value={newTamTruTamVang.lyDo}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã đăng ký, tên nhân khẩu hoặc địa chỉ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đăng ký</TableHead>
              <TableHead>Nhân khẩu</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Từ ngày</TableHead>
              <TableHead>Đến ngày</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTamTruTamVang.length > 0 ? (
              filteredTamTruTamVang.map((tamTruTamVang) => (
                <TableRow key={tamTruTamVang.id}>
                  <TableCell className="font-medium">{tamTruTamVang.maDangKy}</TableCell>
                  <TableCell>{mockNhanKhau[tamTruTamVang.nhanKhauId]?.hoTen || "N/A"}</TableCell>
                  <TableCell>{tamTruTamVang.loai}</TableCell>
                  <TableCell>{new Date(tamTruTamVang.tuNgay).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{new Date(tamTruTamVang.denNgay).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{tamTruTamVang.diaChi}</TableCell>
                  <TableCell>{tamTruTamVang.lyDo}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md !bg-opacity-100">
                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy đăng ký tạm trú/tạm vắng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}