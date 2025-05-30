"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Search } from "lucide-react"
import type { TamTruTamVang, NhanKhau } from "@/types"
import { GET_ALL_TTTV_ROUTE, GET_ALL_NHANKHAU_ROUTE, ADD_TTTV_ROUTE, PUT_TTTV_ROUTE, DELETE_TTTV_ROUTE } from '@/utils/constant'
import { apiClient } from '@/lib/api-client'

export function TamTruTamVangPage() {
  const [tamTruTamVangList, setTamTruTamVangList] = useState<TamTruTamVang[]>([])
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [detailTamTruTamVang, setDetailTamTruTamVang] = useState<TamTruTamVang | null>(null)
  const [selectedTamTruTamVang, setSelectedTamTruTamVang] = useState<Partial<TamTruTamVang>>({
    maDangKy: "",
    nhanKhauId: "",
    loai: "Tạm trú",
    tuNgay: new Date().toISOString().split("T")[0],
    denNgay: "",
    diaChi: "",
    lyDo: "",
  })
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
    const fetchData = async () => {
      try {
        const [getListNhanKhau, getListTttv] = await Promise.all([
          apiClient.get(GET_ALL_NHANKHAU_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_TTTV_ROUTE, { withCredentials: true }),
        ])
        setNhanKhauList(getListNhanKhau.data)
        setTamTruTamVangList(getListTttv.data)
      } catch (error) {
        console.log("Lỗi khi fetch data: ", error)
      }
    }
    fetchData()
  }, [])

  const filteredTamTruTamVang = tamTruTamVangList.filter(
    (tamTruTamVang) =>
      tamTruTamVang.maDangKy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nhanKhauList.find(nhanKhau => nhanKhau.maNhanKhau === tamTruTamVang.nhanKhauId)?.hoTen || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tamTruTamVang.diaChi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTamTruTamVang((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSelectedTamTruTamVang((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)
    try {
      const response = await apiClient.post(ADD_TTTV_ROUTE, newTamTruTamVang, { withCredentials: true })
      if (response.status === 201) {
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
      console.log(error)
    }
  }

  const handleUpdate = async (maDangKy: string) => {
    try {
      const response = await apiClient.put(
        `${PUT_TTTV_ROUTE}/${maDangKy}`,
        selectedTamTruTamVang,
        { withCredentials: true }
      )
      if (response.status === 200) {
        setTamTruTamVangList((prev) =>
          prev.map((tttv) => tttv.maDangKy === maDangKy ? { ...tttv, ...selectedTamTruTamVang } : tttv)
        )
        setIsUpdateDialogOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (maDangKy: string) => {
    try {
      const response = await apiClient.delete(`${DELETE_TTTV_ROUTE}/${maDangKy}`, { withCredentials: true })
      if (response.status === 200) {
        setTamTruTamVangList(tamTruTamVangList.filter((tttv) => tttv.maDangKy !== maDangKy))
        console.log("Xóa đăng ký thành công")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Hàm xem chi tiết: sẽ mở Dialog chi tiết
  const handleOpenDetail = (item: TamTruTamVang) => {
    setDetailTamTruTamVang(item)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Phần thêm mới & tìm kiếm */}
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
                <DialogDescription>Nhập thông tin đăng ký mới</DialogDescription>
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
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Chọn nhân khẩu</option>
                    {nhanKhauList.map((nhanKhau) => (
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
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Cập nhật đăng ký tạm trú/tạm vắng</DialogTitle>
                <DialogDescription>Nhập thông tin cập nhật vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maDangKy" className="text-right">
                    Mã đăng ký
                  </Label>
                  <Input
                    id="maDangKy"
                    name="maDangKy"
                    value={selectedTamTruTamVang.maDangKy}
                    disabled
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
                    value={selectedTamTruTamVang.nhanKhauId}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Chọn nhân khẩu</option>
                    {nhanKhauList.map((nhanKhau) => (
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
                    value={selectedTamTruTamVang.loai}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    value={selectedTamTruTamVang.tuNgay}
                    onChange={handleUpdateInputChange}
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
                    value={selectedTamTruTamVang.denNgay}
                    onChange={handleUpdateInputChange}
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
                    value={selectedTamTruTamVang.diaChi}
                    onChange={handleUpdateInputChange}
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
                    value={selectedTamTruTamVang.lyDo}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleUpdate(selectedTamTruTamVang.maDangKy!)}>
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
                  <TableCell>
                    {nhanKhauList.find(nhanKhau => nhanKhau.maNhanKhau === tamTruTamVang.nhanKhauId)?.hoTen || "N/A"}
                  </TableCell>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTamTruTamVang({
                              maDangKy: tamTruTamVang.maDangKy,
                              nhanKhauId: tamTruTamVang.nhanKhauId,
                              loai: tamTruTamVang.loai,
                              tuNgay: new Date(tamTruTamVang.tuNgay).toISOString().split("T")[0],
                              denNgay: new Date(tamTruTamVang.denNgay).toISOString().split("T")[0],
                              diaChi: tamTruTamVang.diaChi,
                              lyDo: tamTruTamVang.lyDo,
                            })
                            setIsUpdateDialogOpen(true)
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(tamTruTamVang.maDangKy)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký tạm trú/tạm vắng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đăng ký
            </DialogDescription>
          </DialogHeader>

          {detailTamTruTamVang && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Mã đăng ký:</Label>
                <div className="col-span-3">{detailTamTruTamVang.maDangKy}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Nhân khẩu:</Label>
                <div className="col-span-3">
                  {nhanKhauList.find(nhanKhau => nhanKhau.maNhanKhau === detailTamTruTamVang.nhanKhauId)?.hoTen || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Loại:</Label>
                <div className="col-span-3">{detailTamTruTamVang.loai}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Từ ngày:</Label>
                <div className="col-span-3">
                  {new Date(detailTamTruTamVang.tuNgay).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Đến ngày:</Label>
                <div className="col-span-3">
                  {new Date(detailTamTruTamVang.denNgay).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Địa chỉ:</Label>
                <div className="col-span-3">{detailTamTruTamVang.diaChi}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Lý do:</Label>
                <div className="col-span-3">{detailTamTruTamVang.lyDo}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}