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
import type { HoKhau } from "@/types"

// Mock data
const mockHoKhau: HoKhau[] = [
  {
    id: "1",
    maHoKhau: "HK001",
    tenChuHo: "Nguyễn Văn A",
    diaChi: "P.1201, Tòa A, BlueMoon",
    soThanhVien: 4,
    ngayLap: "2022-01-15",
  },
  {
    id: "2",
    maHoKhau: "HK002",
    tenChuHo: "Trần Thị B",
    diaChi: "P.1502, Tòa B, BlueMoon",
    soThanhVien: 3,
    ngayLap: "2022-02-20",
  },
  {
    id: "3",
    maHoKhau: "HK003",
    tenChuHo: "Lê Văn C",
    diaChi: "P.0902, Tòa C, BlueMoon",
    soThanhVien: 5,
    ngayLap: "2022-03-10",
  },
  {
    id: "4",
    maHoKhau: "HK004",
    tenChuHo: "Phạm Thị D",
    diaChi: "P.1103, Tòa A, BlueMoon",
    soThanhVien: 2,
    ngayLap: "2022-04-05",
  },
  {
    id: "5",
    maHoKhau: "HK005",
    tenChuHo: "Hoàng Văn E",
    diaChi: "P.1602, Tòa B, BlueMoon",
    soThanhVien: 6,
    ngayLap: "2022-05-12",
  },
]

export function HoKhauPage() {
  const [hoKhauList] = useState<HoKhau[]>(mockHoKhau)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newHoKhau, setNewHoKhau] = useState<Partial<HoKhau>>({
    maHoKhau: "",
    tenChuHo: "",
    diaChi: "",
    soThanhVien: 1,
    ngayLap: new Date().toISOString().split("T")[0],
  })

  const filteredHoKhau = hoKhauList.filter(
    (hoKhau) =>
      hoKhau.maHoKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoKhau.tenChuHo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoKhau.diaChi.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewHoKhau((prev) => ({
      ...prev,
      [name]: name === "soThanhVien" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add the new household to the database
    console.log("New household:", newHoKhau)
    setIsDialogOpen(false)
    // Reset form
    setNewHoKhau({
      maHoKhau: "",
      tenChuHo: "",
      diaChi: "",
      soThanhVien: 1,
      ngayLap: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Hộ khẩu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm hộ khẩu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
                <DialogDescription>Nhập thông tin hộ khẩu mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maHoKhau" className="text-right">
                    Mã hộ khẩu
                  </Label>
                  <Input
                    id="maHoKhau"
                    name="maHoKhau"
                    value={newHoKhau.maHoKhau}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenChuHo" className="text-right">
                    Tên chủ hộ
                  </Label>
                  <Input
                    id="tenChuHo"
                    name="tenChuHo"
                    value={newHoKhau.tenChuHo}
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
                    value={newHoKhau.diaChi}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soThanhVien" className="text-right">
                    Số thành viên
                  </Label>
                  <Input
                    id="soThanhVien"
                    name="soThanhVien"
                    type="number"
                    min="1"
                    value={newHoKhau.soThanhVien}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayLap" className="text-right">
                    Ngày lập
                  </Label>
                  <Input
                    id="ngayLap"
                    name="ngayLap"
                    type="date"
                    value={newHoKhau.ngayLap}
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
          placeholder="Tìm kiếm theo mã, tên chủ hộ hoặc địa chỉ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hộ khẩu</TableHead>
              <TableHead>Tên chủ hộ</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Số thành viên</TableHead>
              <TableHead>Ngày lập</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHoKhau.length > 0 ? (
              filteredHoKhau.map((hoKhau) => (
                <TableRow key={hoKhau.id}>
                  <TableCell className="font-medium">{hoKhau.maHoKhau}</TableCell>
                  <TableCell>{hoKhau.tenChuHo}</TableCell>
                  <TableCell>{hoKhau.diaChi}</TableCell>
                  <TableCell>{hoKhau.soThanhVien}</TableCell>
                  <TableCell>{new Date(hoKhau.ngayLap).toLocaleDateString("vi-VN")}</TableCell>
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
                          <Link to={`/ho-khau/${hoKhau.id}`}>Xem chi tiết</Link>
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
                <TableCell colSpan={6} className="h-24 text-center">
                  Không tìm thấy hộ khẩu nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}