"use client"

import React, { useState } from "react"
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
import type { PhieuNopTien, KhoanThu, HoKhau } from "@/types"

// Mock data
const mockPhieuNopTien: PhieuNopTien[] = [
  {
    id: "1",
    maPhieu: "PT001",
    khoanThuId: "1",
    hoKhauId: "1",
    nguoiNop: "Nguyễn Văn A",
    soTien: 700000,
    ngayNop: "2023-01-15",
    nguoiThu: "Admin",
    ghiChu: "",
  },
  {
    id: "2",
    maPhieu: "PT002",
    khoanThuId: "2",
    hoKhauId: "1",
    nguoiNop: "Nguyễn Văn A",
    soTien: 100000,
    ngayNop: "2023-01-15",
    nguoiThu: "Admin",
    ghiChu: "",
  },
  {
    id: "3",
    maPhieu: "PT003",
    khoanThuId: "1",
    hoKhauId: "2",
    nguoiNop: "Trần Thị B",
    soTien: 700000,
    ngayNop: "2023-01-20",
    nguoiThu: "Admin",
    ghiChu: "",
  },
  {
    id: "4",
    maPhieu: "PT004",
    khoanThuId: "5",
    hoKhauId: "3",
    nguoiNop: "Lê Văn C",
    soTien: 500000,
    ngayNop: "2023-03-20",
    nguoiThu: "Admin",
    ghiChu: "Đóng góp tự nguyện",
  },
]

// Mock data for KhoanThu
const mockKhoanThu: Record<string, KhoanThu> = {
  "1": {
    id: "1",
    maKhoanThu: "KT001",
    tenKhoanThu: "Phí dịch vụ chung cư",
    loai: "Bắt buộc",
    soTien: 700000,
    ngayTao: "2023-01-01",
    ghiChu: "Thu hàng tháng",
  },
  "2": {
    id: "2",
    maKhoanThu: "KT002",
    tenKhoanThu: "Phí gửi xe máy",
    loai: "Bắt buộc",
    soTien: 100000,
    ngayTao: "2023-01-01",
    ghiChu: "Thu hàng tháng",
  },
  "5": {
    id: "5",
    maKhoanThu: "KT005",
    tenKhoanThu: "Quỹ từ thiện",
    loai: "Tự nguyện",
    ngayTao: "2023-03-15",
    ghiChu: "Tùy tâm",
  },
}

// Mock data for HoKhau
const mockHoKhau: Record<string, HoKhau> = {
  "1": {
    id: "1",
    maHoKhau: "HK001",
    tenChuHo: "Nguyễn Văn A",
    diaChi: "P.1201, Tòa A, BlueMoon",
    soThanhVien: 4,
    ngayLap: "2022-01-15",
  },
  "2": {
    id: "2",
    maHoKhau: "HK002",
    tenChuHo: "Trần Thị B",
    diaChi: "P.1502, Tòa B, BlueMoon",
    soThanhVien: 3,
    ngayLap: "2022-02-20",
  },
  "3": {
    id: "3",
    maHoKhau: "HK003",
    tenChuHo: "Lê Văn C",
    diaChi: "P.0902, Tòa C, BlueMoon",
    soThanhVien: 5,
    ngayLap: "2022-03-10",
  },
}

export function ThuPhiPage() {
  const [phieuNopTienList, setPhieuNopTienList] = useState<PhieuNopTien[]>(mockPhieuNopTien)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPhieuNopTien, setNewPhieuNopTien] = useState<Partial<PhieuNopTien>>({
    maPhieu: "",
    khoanThuId: "",
    hoKhauId: "",
    nguoiNop: "",
    soTien: 0,
    ngayNop: new Date().toISOString().split("T")[0],
    nguoiThu: "Admin",
    ghiChu: "",
  })

  // State cho sửa phiếu
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editPhieu, setEditPhieu] = useState<PhieuNopTien | null>(null)

  const filteredPhieuNopTien = phieuNopTienList.filter(
    (phieu) =>
      phieu.maPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mockHoKhau[phieu.hoKhauId]?.tenChuHo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mockKhoanThu[phieu.khoanThuId]?.tenKhoanThu || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPhieuNopTien((prev) => ({
      ...prev,
      [name]: name === "soTien" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add the new payment to the database
    const newPhieu: PhieuNopTien = {
      ...newPhieuNopTien,
      id: (phieuNopTienList.length + 1).toString(),
    } as PhieuNopTien
    setPhieuNopTienList((prev) => [...prev, newPhieu])
    setIsDialogOpen(false)
    setNewPhieuNopTien({
      maPhieu: "",
      khoanThuId: "",
      hoKhauId: "",
      nguoiNop: "",
      soTien: 0,
      ngayNop: new Date().toISOString().split("T")[0],
      nguoiThu: "Admin",
      ghiChu: "",
    })
  }

  // Sửa phiếu
  const handleOpenEdit = (phieu: PhieuNopTien) => {
    setEditPhieu(phieu)
    setIsEditDialogOpen(true)
  }

  const handleDeletePhieu = (id: string) => {
  setPhieuNopTienList(prev => prev.filter(phieu => phieu.id !== id))
}

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditPhieu((prev) =>
      prev
        ? {
          ...prev,
          [name]: name === "soTien" ? Number.parseInt(value) : value,
        }
        : prev
    )
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editPhieu) {
      setPhieuNopTienList((prev) =>
        prev.map((p) => (p.id === editPhieu.id ? editPhieu : p))
      )
      setIsEditDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Thu phí</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm phiếu nộp tiền
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm phiếu nộp tiền mới</DialogTitle>
                <DialogDescription>Nhập thông tin phiếu nộp tiền mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maPhieu" className="text-right">
                    Mã phiếu
                  </Label>
                  <Input
                    id="maPhieu"
                    name="maPhieu"
                    value={newPhieuNopTien.maPhieu}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="khoanThuId" className="text-right">
                    Khoản thu
                  </Label>
                  <select
                    id="khoanThuId"
                    name="khoanThuId"
                    value={newPhieuNopTien.khoanThuId}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn khoản thu</option>
                    {Object.values(mockKhoanThu).map((khoanThu) => (
                      <option key={khoanThu.id} value={khoanThu.id}>
                        {khoanThu.tenKhoanThu} - {khoanThu.maKhoanThu}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hoKhauId" className="text-right">
                    Hộ khẩu
                  </Label>
                  <select
                    id="hoKhauId"
                    name="hoKhauId"
                    value={newPhieuNopTien.hoKhauId}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn hộ khẩu</option>
                    {Object.values(mockHoKhau).map((hoKhau) => (
                      <option key={hoKhau.id} value={hoKhau.id}>
                        {hoKhau.tenChuHo} - {hoKhau.maHoKhau}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nguoiNop" className="text-right">
                    Người nộp
                  </Label>
                  <Input
                    id="nguoiNop"
                    name="nguoiNop"
                    value={newPhieuNopTien.nguoiNop}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soTien" className="text-right">
                    Số tiền
                  </Label>
                  <Input
                    id="soTien"
                    name="soTien"
                    type="number"
                    value={newPhieuNopTien.soTien}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayNop" className="text-right">
                    Ngày nộp
                  </Label>
                  <Input
                    id="ngayNop"
                    name="ngayNop"
                    type="date"
                    value={newPhieuNopTien.ngayNop}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nguoiThu" className="text-right">
                    Người thu
                  </Label>
                  <Input
                    id="nguoiThu"
                    name="nguoiThu"
                    value={newPhieuNopTien.nguoiThu}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ghiChu" className="text-right">
                    Ghi chú
                  </Label>
                  <Input
                    id="ghiChu"
                    name="ghiChu"
                    value={newPhieuNopTien.ghiChu}
                    onChange={handleInputChange}
                    className="col-span-3"
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
          placeholder="Tìm kiếm theo mã phiếu, tên chủ hộ hoặc khoản thu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Khoản thu</TableHead>
              <TableHead>Hộ khẩu</TableHead>
              <TableHead>Người nộp</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Ngày nộp</TableHead>
              <TableHead>Người thu</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPhieuNopTien.length > 0 ? (
              filteredPhieuNopTien.map((phieu) => (
                <TableRow key={phieu.id}>
                  <TableCell className="font-medium">{phieu.maPhieu}</TableCell>
                  <TableCell>{mockKhoanThu[phieu.khoanThuId]?.tenKhoanThu || "N/A"}</TableCell>
                  <TableCell>{mockHoKhau[phieu.hoKhauId]?.tenChuHo || "N/A"}</TableCell>
                  <TableCell>{phieu.nguoiNop}</TableCell>
                  <TableCell>{phieu.soTien.toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell>{new Date(phieu.ngayNop).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{phieu.nguoiThu}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md !bg-opacity-100">
                        <DropdownMenuItem onClick={() => handleOpenEdit(phieu)}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem>In phiếu thu</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePhieu(phieu.id)}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy phiếu nộp tiền nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog sửa phiếu nộp tiền */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Sửa phiếu nộp tiền</DialogTitle>
              <DialogDescription>Chỉnh sửa thông tin phiếu nộp tiền</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maPhieu" className="text-right">
                  Mã phiếu
                </Label>
                <Input
                  id="maPhieu"
                  name="maPhieu"
                  value={editPhieu?.maPhieu || ""}
                  onChange={handleEditChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="khoanThuId" className="text-right">
                  Khoản thu
                </Label>
                <select
                  id="khoanThuId"
                  name="khoanThuId"
                  value={editPhieu?.khoanThuId || ""}
                  onChange={handleEditChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Chọn khoản thu</option>
                  {Object.values(mockKhoanThu).map((khoanThu) => (
                    <option key={khoanThu.id} value={khoanThu.id}>
                      {khoanThu.tenKhoanThu} - {khoanThu.maKhoanThu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hoKhauId" className="text-right">
                  Hộ khẩu
                </Label>
                <select
                  id="hoKhauId"
                  name="hoKhauId"
                  value={editPhieu?.hoKhauId || ""}
                  onChange={handleEditChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Chọn hộ khẩu</option>
                  {Object.values(mockHoKhau).map((hoKhau) => (
                    <option key={hoKhau.id} value={hoKhau.id}>
                      {hoKhau.tenChuHo} - {hoKhau.maHoKhau}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nguoiNop" className="text-right">
                  Người nộp
                </Label>
                <Input
                  id="nguoiNop"
                  name="nguoiNop"
                  value={editPhieu?.nguoiNop || ""}
                  onChange={handleEditChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="soTien" className="text-right">
                  Số tiền
                </Label>
                <Input
                  id="soTien"
                  name="soTien"
                  type="number"
                  value={editPhieu?.soTien || ""}
                  onChange={handleEditChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ngayNop" className="text-right">
                  Ngày nộp
                </Label>
                <Input
                  id="ngayNop"
                  name="ngayNop"
                  type="date"
                  value={editPhieu?.ngayNop || ""}
                  onChange={handleEditChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nguoiThu" className="text-right">
                  Người thu
                </Label>
                <Input
                  id="nguoiThu"
                  name="nguoiThu"
                  value={editPhieu?.nguoiThu || ""}
                  onChange={handleEditChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ghiChu" className="text-right">
                  Ghi chú
                </Label>
                <Input
                  id="ghiChu"
                  name="ghiChu"
                  value={editPhieu?.ghiChu || ""}
                  onChange={handleEditChange}
                  className="col-span-3"
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
  )
}