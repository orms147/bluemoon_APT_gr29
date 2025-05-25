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
import type { KhoanThu } from "@/types"
import { apiClient } from '@/lib/api-client'
import { GET_ALL_KHOANTHU_ROUTE, ADD_KHOANTHU_ROUTE, PUT_KHOANTHU_ROUTE, DELETE_KHOANTHU_ROUTE } from '@/utils/constant'

export function KhoanThuPage() {
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [newKhoanThu, setNewKhoanThu] = useState<Partial<KhoanThu>>({
    maKhoanThu: "",
    tenKhoanThu: "",
    loai: "Bắt buộc",
    soTien: 0,
    ngayTao: new Date().toISOString().split("T")[0],
    ghiChu: "",
  })
  const [currKhoanThu, setCurrKhoanThu] = useState<Partial<KhoanThu>>({
    maKhoanThu: "",
    tenKhoanThu: "",
    loai: "Bắt buộc",
    soTien: 0,
    ngayTao: new Date().toISOString().split("T")[0],
    ghiChu: "",
  })

  useEffect(() => {
    const getListKhoanThu = async () => {
      const response = await apiClient.get(
        GET_ALL_KHOANTHU_ROUTE,
        {withCredentials: true}
      );
      setKhoanThuList(response.data)
    }

    getListKhoanThu()
  },[])

  const filteredKhoanThu = khoanThuList.filter(
    (khoanThu) =>
      khoanThu.maKhoanThu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      khoanThu.tenKhoanThu.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewKhoanThu((prev) => ({
      ...prev,
      [name]: name === "soTien" ? Number.parseInt(value) : value,
    }))
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrKhoanThu((prev) => ({
      ...prev,
      [name]: name === "soTien" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New fee:", newKhoanThu)
    setIsDialogOpen(false)
    
    try {
      const response = await apiClient.post(
        ADD_KHOANTHU_ROUTE,
        newKhoanThu,
        {withCredentials: true}
      )
      if (response.status === 201){
        setNewKhoanThu({
          maKhoanThu: "",
          tenKhoanThu: "",
          loai: "Bắt buộc",
          soTien: 0,
          ngayTao: new Date().toISOString().split("T")[0],
          ghiChu: "",
        })
        setKhoanThuList([...khoanThuList, response.data])
      }
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (maKhoanThu : string ) => {
    try {
      const response = await apiClient.put(
        `${PUT_KHOANTHU_ROUTE}/${maKhoanThu}`,
        currKhoanThu,
        {withCredentials: true}
      );
      if (response.status === 200) {
        setKhoanThuList((prev) => 
          prev.map((khoanThu) =>
          khoanThu.maKhoanThu === maKhoanThu ? {...khoanThu, ...currKhoanThu} : khoanThu
        ))
        setIsUpdateDialogOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async(maKhoanThu : string) => {
    try {
      const response = await apiClient.delete(
        `${DELETE_KHOANTHU_ROUTE}/${maKhoanThu}`,
        {withCredentials: true}
      );
      if (response.status === 200){
        console.log("Xóa khoản thu thành công")
        setKhoanThuList(khoanThuList.filter((khoanThu) => khoanThu.maKhoanThu != maKhoanThu))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Khoản thu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khoản thu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm khoản thu mới</DialogTitle>
                <DialogDescription>Nhập thông tin khoản thu mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maKhoanThu" className="text-right">
                    Mã khoản thu
                  </Label>
                  <Input
                    id="maKhoanThu"
                    name="maKhoanThu"
                    value={newKhoanThu.maKhoanThu}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenKhoanThu" className="text-right">
                    Tên khoản thu
                  </Label>
                  <Input
                    id="tenKhoanThu"
                    name="tenKhoanThu"
                    value={newKhoanThu.tenKhoanThu}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loai" className="text-right">
                    Loại
                  </Label>
                  <select
                    id="loai"
                    name="loai"
                    value={newKhoanThu.loai}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Bắt buộc">Bắt buộc</option>
                    <option value="Tự nguyện">Tự nguyện</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soTien" className="text-right">
                    Số tiền
                  </Label>
                  <Input
                    id="soTien"
                    name="soTien"
                    type="number"
                    value={newKhoanThu.soTien}
                    onChange={handleInputChange}
                    className="col-span-3"
                    disabled={newKhoanThu.loai === "Tự nguyện"}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayTao" className="text-right">
                    Ngày tạo
                  </Label>
                  <Input
                    id="ngayTao"
                    name="ngayTao"
                    type="date"
                    value={newKhoanThu.ngayTao}
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
                    value={newKhoanThu.ghiChu}
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

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={(e) => e.preventDefault()}>
              <DialogHeader> 
                <DialogTitle>Cập nhật thông tin khoản thu</DialogTitle>
                <DialogDescription>Nhập thông tin cập nhật vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maKhoanThu" className="text-right">
                    Mã khoản thu
                  </Label>
                  <Input
                    id="maKhoanThu"
                    name="maKhoanThu"
                    value={currKhoanThu.maKhoanThu}
                    disabled
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenKhoanThu" className="text-right">
                    Tên khoản thu
                  </Label>
                  <Input
                    id="tenKhoanThu"
                    name="tenKhoanThu"
                    value={currKhoanThu.tenKhoanThu}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loai" className="text-right">
                    Loại
                  </Label>
                  <select
                    id="loai"
                    name="loai"
                    value={currKhoanThu.loai}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Bắt buộc">Bắt buộc</option>
                    <option value="Tự nguyện">Tự nguyện</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soTien" className="text-right">
                    Số tiền
                  </Label>
                  <Input
                    id="soTien"
                    name="soTien"
                    type="number"
                    value={currKhoanThu.soTien}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                    disabled={currKhoanThu.loai === "Tự nguyện"}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayTao" className="text-right">
                    Ngày tạo
                  </Label>
                  <Input
                    id="ngayTao"
                    name="ngayTao"
                    type="date"
                    value={currKhoanThu.ngayTao}
                    onChange={handleUpdateInputChange}
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
                    value={currKhoanThu.ghiChu}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick = {() => handleUpdate(currKhoanThu.maKhoanThu!)}
                >
                  Cập nhật
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã hoặc tên khoản thu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã khoản thu</TableHead>
              <TableHead>Tên khoản thu</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKhoanThu.length > 0 ? (
              filteredKhoanThu.map((khoanThu) => (
                <TableRow key={khoanThu.maKhoanThu}>
                  <TableCell className="font-medium">{khoanThu.maKhoanThu}</TableCell>
                  <TableCell>{khoanThu.tenKhoanThu}</TableCell>
                  <TableCell>{khoanThu.loai}</TableCell>
                  <TableCell>
                    {khoanThu.soTien ? khoanThu.soTien.toLocaleString("vi-VN") + " VND" : "Tùy tâm"}
                  </TableCell>
                  <TableCell>{new Date(khoanThu.ngayTao).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{khoanThu.ghiChu}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrKhoanThu({
                                maKhoanThu: khoanThu.maKhoanThu,
                                tenKhoanThu: khoanThu.tenKhoanThu,
                                loai: khoanThu.loai,
                                soTien: khoanThu.soTien,
                                ngayTao: new Date(khoanThu.ngayTao).toISOString().split("T")[0],
                                ghiChu: khoanThu.ghiChu,
                              })
                            setIsUpdateDialogOpen(true)
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => handleDelete(khoanThu.maKhoanThu)}
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
                  Không tìm thấy khoản thu nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}