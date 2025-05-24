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
import type { TamTruTamVang, NhanKhau } from "@/types"
import { GET_ALL_TTTV_ROUTE, GET_ALL_NHANKHAU_ROUTE, ADD_TTTV_ROUTE, DELETE_TTTV_ROUTE } from '@/utils/constant'
import { apiClient } from '@/lib/api-client' 

export function TamTruTamVangPage() {
  const [tamTruTamVangList,setTamTruTamVangList] = useState<TamTruTamVang[]>([])
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [detailTamTruTamVang, setDetailTamTruTamVang] = useState<TamTruTamVang | null>(null)
  const [editTamTruTamVang, setEditTamTruTamVang] = useState<TamTruTamVang | null>(null)
  const [newTamTruTamVang, setNewTamTruTamVang] = useState<Partial<TamTruTamVang>>({
    maDangKy: "",
    nhanKhauId: "",
    loai: "Tạm trú",
    tuNgay: new Date().toISOString().split("T")[0],
    denNgay: "",
    diaChi: "",
    lyDo: "",
  })

  useEffect(() => {
    const fetchData = async() => {
      try {
        const [getListNhanKhau, getListTttv] = await Promise.all([
          apiClient.get(GET_ALL_NHANKHAU_ROUTE, {withCredentials: true}),
          apiClient.get(GET_ALL_TTTV_ROUTE, {withCredentials: true}),
        ])
        setNhanKhauList(getListNhanKhau.data)
        setTamTruTamVangList(getListTttv.data)
      } catch (error){
        console.log("Lỗi khi fetch data: ", error) 
      }
    }

    fetchData()
  }, [])

  const filteredTamTruTamVang = tamTruTamVangList.filter(
    (tamTruTamVang) =>
      tamTruTamVang.maDangKy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nhanKhauList.find(nhanKhau => nhanKhau.maNhanKhau === tamTruTamVang.nhanKhauId)?.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      tamTruTamVang.diaChi.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTamTruTamVang((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleDeleteTamTruTamVang = (id: string) => {
    setTamTruTamVangList(list => list.filter(item => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)
    // Reset form
    try {
      const response = await apiClient.post(
        ADD_TTTV_ROUTE,
        newTamTruTamVang,
        {withCredentials: true}
      )
      if (response.status === 201){
        console.log(response.data)
        setTamTruTamVangList([...tamTruTamVangList, response.data])
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
    } catch (error) {
      console.log(error);
    }
    
  }

  const handleDelete = async (maDangKy: string) => {
    try {
      const response = await apiClient.delete(
        `${DELETE_TTTV_ROUTE}/${maDangKy}`,
        {withCredentials: true}
      )
      if (response.status === 200){
        setTamTruTamVangList(tamTruTamVangList.filter((tttv) => tttv.maDangKy !== maDangKy))
        console.log("Xóa phiếu đăng ký thành công")
      }
    } catch (error){
      console.log(error);
    }
  }

  // Xem chi tiết
  const handleOpenDetail = (item: TamTruTamVang) => {
    setDetailTamTruTamVang(item)
    setIsDetailDialogOpen(true)
  }

  // Sửa
  const handleOpenEdit = (item: TamTruTamVang) => {
    setEditTamTruTamVang(item)
    setIsEditDialogOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditTamTruTamVang(prev =>
      prev ? { ...prev, [name]: value } : prev
    )
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editTamTruTamVang) {
      setTamTruTamVangList(list =>
        list.map(item => item.id === editTamTruTamVang.id ? editTamTruTamVang : item)
      )
      setIsEditDialogOpen(false)
    }
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
                    {Object.values(nhanKhauList).map((nhanKhau) => (
                      <option key={nhanKhau.maNhanKhau} value={nhanKhau.maNhanKhau}>
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
                <TableRow key={tamTruTamVang.maDangKy}>
                  <TableCell className="font-medium">{tamTruTamVang.maDangKy}</TableCell>
                  <TableCell>{nhanKhauList.find(nhanKhau => nhanKhau.maNhanKhau == tamTruTamVang.nhanKhauId)?.hoTen || "N/A"}</TableCell>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDetail(tamTruTamVang)}>
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(tamTruTamVang)}>
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteTamTruTamVang(tamTruTamVang.maDangKy)}
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
                  Không tìm thấy đăng ký tạm trú/tạm vắng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog xem chi tiết */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký tạm trú/tạm vắng</DialogTitle>
          </DialogHeader>
          {detailTamTruTamVang && (
            <div className="space-y-2">
              <div><b>Mã đăng ký:</b> {detailTamTruTamVang.maDangKy}</div>
              <div><b>Nhân khẩu:</b> {mockNhanKhau[detailTamTruTamVang.nhanKhauId]?.hoTen || "N/A"}</div>
              <div><b>Loại:</b> {detailTamTruTamVang.loai}</div>
              <div><b>Từ ngày:</b> {new Date(detailTamTruTamVang.tuNgay).toLocaleDateString("vi-VN")}</div>
              <div><b>Đến ngày:</b> {new Date(detailTamTruTamVang.denNgay).toLocaleDateString("vi-VN")}</div>
              <div><b>Địa chỉ:</b> {detailTamTruTamVang.diaChi}</div>
              <div><b>Lý do:</b> {detailTamTruTamVang.lyDo}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog sửa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa đăng ký tạm trú/tạm vắng</DialogTitle>
          </DialogHeader>
          {editTamTruTamVang && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Mã đăng ký</Label>
                  <Input
                    name="maDangKy"
                    value={editTamTruTamVang.maDangKy}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label>Nhân khẩu</Label>
                  <select
                    name="nhanKhauId"
                    value={editTamTruTamVang.nhanKhauId}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Chọn nhân khẩu</option>
                    {Object.values(mockNhanKhau).map(nk => (
                      <option key={nk.id} value={nk.id}>
                        {nk.hoTen} - {nk.maNhanKhau}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Loại</Label>
                  <select
                    name="loai"
                    value={editTamTruTamVang.loai}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="Tạm trú">Tạm trú</option>
                    <option value="Tạm vắng">Tạm vắng</option>
                  </select>
                </div>
                <div>
                  <Label>Từ ngày</Label>
                  <Input
                    type="date"
                    name="tuNgay"
                    value={editTamTruTamVang.tuNgay}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label>Đến ngày</Label>
                  <Input
                    type="date"
                    name="denNgay"
                    value={editTamTruTamVang.denNgay}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label>Địa chỉ</Label>
                  <Input
                    name="diaChi"
                    value={editTamTruTamVang.diaChi}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label>Lý do</Label>
                  <Input
                    name="lyDo"
                    value={editTamTruTamVang.lyDo}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
