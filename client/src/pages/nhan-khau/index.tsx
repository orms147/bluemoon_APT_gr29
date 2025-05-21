"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
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
import type { NhanKhau } from "@/types"

// Mock data
const mockNhanKhau: NhanKhau[] = [
  {
    id: "1",
    maNhanKhau: "NK001",
    hoTen: "Nguyễn Văn A",
    ngaySinh: "1980-05-15",
    gioiTinh: "Nam",
    cccd: "012345678901",
    hoKhauId: "1",
    quanHe: "Chủ hộ",
  },
  {
    id: "2",
    maNhanKhau: "NK002",
    hoTen: "Nguyễn Thị X",
    ngaySinh: "1985-08-20",
    gioiTinh: "Nữ",
    cccd: "012345678902",
    hoKhauId: "1",
    quanHe: "Vợ",
  },
  {
    id: "3",
    maNhanKhau: "NK003",
    hoTen: "Nguyễn Văn Y",
    ngaySinh: "2010-03-10",
    gioiTinh: "Nam",
    cccd: "012345678903",
    hoKhauId: "1",
    quanHe: "Con",
  },
  {
    id: "4",
    maNhanKhau: "NK004",
    hoTen: "Nguyễn Thị Z",
    ngaySinh: "2015-12-25",
    gioiTinh: "Nữ",
    cccd: "012345678904",
    hoKhauId: "1",
    quanHe: "Con",
  },
  {
    id: "5",
    maNhanKhau: "NK005",
    hoTen: "Trần Thị B",
    ngaySinh: "1975-11-30",
    gioiTinh: "Nữ",
    cccd: "012345678905",
    hoKhauId: "2",
    quanHe: "Chủ hộ",
  },
]

export function NhanKhauPage() {
  const [nhanKhauList] = useState<NhanKhau[]>(mockNhanKhau)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNhanKhau, setNewNhanKhau] = useState<Partial<NhanKhau>>({
    maNhanKhau: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    cccd: "",
  })

  const filteredNhanKhau = nhanKhauList.filter(
    (nhanKhau) =>
      nhanKhau.maNhanKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nhanKhau.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nhanKhau.cccd.includes(searchTerm),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewNhanKhau((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add the new resident to the database
    console.log("New resident:", newNhanKhau)
    setIsDialogOpen(false)
    // Reset form
    setNewNhanKhau({
      maNhanKhau: "",
      hoTen: "",
      ngaySinh: "",
      gioiTinh: "Nam",
      cccd: "",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhân khẩu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân khẩu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm nhân khẩu mới</DialogTitle>
                <DialogDescription>Nhập thông tin nhân khẩu mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maNhanKhau" className="text-right">
                    Mã nhân khẩu
                  </Label>
                  <Input
                    id="maNhanKhau"
                    name="maNhanKhau"
                    value={newNhanKhau.maNhanKhau}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hoTen" className="text-right">
                    Họ tên
                  </Label>
                  <Input
                    id="hoTen"
                    name="hoTen"
                    value={newNhanKhau.hoTen}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngaySinh" className="text-right">
                    Ngày sinh
                  </Label>
                  <Input
                    id="ngaySinh"
                    name="ngaySinh"
                    type="date"
                    value={newNhanKhau.ngaySinh}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gioiTinh" className="text-right">
                    Giới tính
                  </Label>
                  <select
                    id="gioiTinh"
                    name="gioiTinh"
                    value={newNhanKhau.gioiTinh}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cccd" className="text-right">
                    CCCD
                  </Label>
                  <Input
                    id="cccd"
                    name="cccd"
                    value={newNhanKhau.cccd}
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
          placeholder="Tìm kiếm theo mã, họ tên hoặc CCCD..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NK</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>CCCD</TableHead>
              <TableHead>Hộ khẩu</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNhanKhau.length > 0 ? (
              filteredNhanKhau.map((nhanKhau) => (
                <TableRow key={nhanKhau.id}>
                  <TableCell className="font-medium">{nhanKhau.maNhanKhau}</TableCell>
                  <TableCell>{nhanKhau.hoTen}</TableCell>
                  <TableCell>{new Date(nhanKhau.ngaySinh).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{nhanKhau.gioiTinh}</TableCell>
                  <TableCell>{nhanKhau.cccd}</TableCell>
                  <TableCell>
                    {nhanKhau.hoKhauId ? (
                      <Link to={`/ho-khau/${nhanKhau.hoKhauId}`} className="text-blue-600 hover:underline">
                        Xem hộ khẩu
                      </Link>
                    ) : (
                      "Chưa có"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/nhan-khau/${nhanKhau.id}`}>Xem chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không tìm thấy nhân khẩu nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}