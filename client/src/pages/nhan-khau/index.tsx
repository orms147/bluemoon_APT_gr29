"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { apiClient } from "@/lib/api-client"
import { ADD_NHANKHAU_ROUTE, GET_ALL_NHANKHAU_ROUTE, DELETE_NHANKHAU_ROUTE } from "@/utils/constant"

export function NhanKhauPage() {
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNhanKhau, setNewNhanKhau] = useState<Partial<NhanKhau>>({
    maNhanKhau: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    cccd: "",
  })

  useEffect(() => {
    const getAllNk = async() => {
      const response = await apiClient.get(
        GET_ALL_NHANKHAU_ROUTE,
        {withCredentials: true}
      )
      setNhanKhauList(response.data)
    }
    getAllNk()
  },[])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New resident:", newNhanKhau)
    setIsDialogOpen(false)
    try {
      const response = await apiClient.post(
        ADD_NHANKHAU_ROUTE,
        newNhanKhau,
        {withCredentials: true}
      )
      if (response.status == 201){
        console.log("Thêm nhân khẩu mới thành công");
        // Reset form
        setNewNhanKhau({
          maNhanKhau: "",
          hoTen: "",
          ngaySinh: "",
          gioiTinh: "Nam",
          cccd: "",
        })
        setNhanKhauList((prev) => [...prev, response.data])
      }
      console.log(response)
    } catch (error){
      console.log(error);
    }
    
  }

  const handleDelete = async(maNhanKhau : string) => {
    try { 
      const response = await apiClient.delete(
        `${DELETE_NHANKHAU_ROUTE}/${maNhanKhau}`,
        {withCredentials: true}
      )
      if (response.status == 200){
        console.log("Xóa nhân khẩu thành công");
        setNhanKhauList((prev) => prev.filter((nhanKhau) => nhanKhau.maNhanKhau !== maNhanKhau));
      } 
    } catch (error) {
      console.log(error);
    }
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
                <TableRow key={nhanKhau.maNhanKhau}>
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
                          <Link to={`/nhan-khau/${nhanKhau.maNhanKhau}`}>Xem chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(nhanKhau.maNhanKhau)}
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