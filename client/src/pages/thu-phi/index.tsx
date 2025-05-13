"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { apiClient } from '@/lib/api-client'
import { GET_ALL_HOKHAU_ROUTE, GET_ALL_KHOANTHU_ROUTE, GET_ALL_PHIEUNOP_ROUTE, ADD_PHIEUNOP_ROUTE, DELETE_PHIEUNOP_ROUTE } from '@/utils/constant'

export function ThuPhiPage() {
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([])
  const [phieuNopTienList,setPhieuNopTienList] = useState<PhieuNopTien[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPhieuNopTien, setNewPhieuNopTien] = useState<Partial<PhieuNopTien>>({
    maPhieu: "",
    maKhoanThu: "",
    maHoKhau: "",
    nguoiNop: "",
    soTien: 0,
    ngayNop: new Date().toISOString().split("T")[0],
    nguoiThu: "Admin",
    ghiChu: "",
  })

  useEffect(() => {
    const getListHoKhau = async() => {
      const response = await apiClient.get(
        GET_ALL_HOKHAU_ROUTE,
        {withCredentials: true}
      )
      setHoKhauList(response.data)
    }
    const getListKhoanThu = async() => {
      const response = await apiClient.get(
        GET_ALL_KHOANTHU_ROUTE,
        {withCredentials: true}
      )
      setKhoanThuList(response.data)
    }
    const getListPhieuNop = async() => {
      const response = await apiClient.get(
        GET_ALL_PHIEUNOP_ROUTE,
        {withCredentials: true}
      )
      setPhieuNopTienList(response.data)
    }
    getListHoKhau()
    getListKhoanThu()
    getListPhieuNop()
  },[])

  const filteredPhieuNopTien = phieuNopTienList.filter(
    (phieu) =>
      phieu.maPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hoKhauList[phieu.maHoKhau]?.tenChuHo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (khoanThuList[phieu.maKhoanThu]?.tenKhoanThu || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPhieuNopTien((prev) => ({
      ...prev,
      [name]: name === "soTien" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)
    try {
      const response = await apiClient.post(
        ADD_PHIEUNOP_ROUTE,
        newPhieuNopTien,
        {withCredentials: true}
      )
      if (response.status === 201){
        // Reset form
        setNewPhieuNopTien({
          maPhieu: "",
          maKhoanThu: "",
          maHoKhau: "",
          nguoiNop: "",
          soTien: 0,
          ngayNop: new Date().toISOString().split("T")[0],
          nguoiThu: "Admin",
          ghiChu: "",
        })
        setPhieuNopTienList([...phieuNopTienList, response.data])
      }
    } catch (error) { 
      console.log(error)
    }
  }

  const handleDelete = async (maPhieu: string) => {
    try {
      const response = await apiClient.delete(
        `${DELETE_PHIEUNOP_ROUTE}/${maPhieu}`,
        {withCredentials: true}
      )
      if (response.status == 200){
        console.log("Xóa nhân khẩu thành công");
        setPhieuNopTienList((prev) => prev.filter((phieuNop) => phieuNop.maPhieu !== maPhieu));
      } 
    } catch (error) {
      console.log(error)
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
                  <Label htmlFor="maKhoanThu" className="text-right">
                    Khoản thu
                  </Label>
                  <select
                    id="maKhoanThu"
                    name="maKhoanThu"
                    value={newPhieuNopTien.maKhoanThu}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn khoản thu</option>
                    {Object.values(khoanThuList).map((khoanThu) => (
                      <option key={khoanThu.maKhoanThu} value={khoanThu.maKhoanThu}>
                        {khoanThu.tenKhoanThu} - {khoanThu.maKhoanThu}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maHoKhau" className="text-right">
                    Hộ khẩu
                  </Label>
                  <select
                    id="maHoKhau"
                    name="maHoKhau"
                    value={newPhieuNopTien.maHoKhau}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn hộ khẩu</option>
                    {Object.values(hoKhauList).map((hoKhau) => (
                      <option key={hoKhau.maHoKhau} value={hoKhau.maHoKhau}>
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
                <TableRow key={phieu.maPhieu}>
                  <TableCell className="font-medium">{phieu.maPhieu}</TableCell>
                  <TableCell>{khoanThuList.find(khoanThu => khoanThu.maKhoanThu == phieu.maKhoanThu)?.tenKhoanThu || "N/A"}</TableCell>
                  <TableCell>{hoKhauList.find(hoKhau => hoKhau.maHoKhau == phieu.maHoKhau)?.tenChuHo || "N/A"}</TableCell>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem>In phiếu thu</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(phieu.maPhieu)}
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
    </div>
  )
}