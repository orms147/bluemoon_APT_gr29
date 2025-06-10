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
import { Plus, MoreHorizontal, Search, Car, Bike } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PhuongTien, HoKhau, NhanKhau } from "@/types"
import { apiClient } from "@/lib/api-client"
import {
  GET_ALL_PHUONGTIEN_ROUTE,
  ADD_PHUONGTIEN_ROUTE,
  PUT_PHUONGTIEN_ROUTE,
  DELETE_PHUONGTIEN_ROUTE,
  GET_ALL_HOKHAU_ROUTE,
  GET_ALL_NHANKHAU_ROUTE,
} from "@/utils/constant"
import { ValidationRules, validateForm } from "@/utils/validation.ts"
import { FormField } from "@/components/ui/form-field.tsx"

export function PhuongTienPage() {
  const [phuongTienList, setPhuongTienList] = useState<PhuongTien[]>([])
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [newPhuongTien, setNewPhuongTien] = useState<Partial<PhuongTien>>({
    maPhuongTien: "",
    maHoKhau: "",
    loaiXe: "Xe máy",
    bienSo: "",
    tenChuXe: "",
    ngayDangKy: new Date().toISOString().split("T")[0],
    ghiChu: "",
  })
  const [currPhuongTien, setCurrPhuongTien] = useState<Partial<PhuongTien>>({
    maPhuongTien: "",
    maHoKhau: "",
    loaiXe: "Xe máy",
    bienSo: "",
    tenChuXe: "",
    ngayDangKy: new Date().toISOString().split("T")[0],
    ghiChu: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({})

  // Validation rules
  const validationRules = {
    maPhuongTien: {
      required: true,
      label: "Mã phương tiện",
      validation: ValidationRules.code,
    },
    bienSo: {
      required: true,
      label: "Biển số",
      validation: ValidationRules.licensePlate,
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [phuongTienRes, hoKhauRes, nhanKhauRes] = await Promise.all([
          apiClient.get(GET_ALL_PHUONGTIEN_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_HOKHAU_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_NHANKHAU_ROUTE, { withCredentials: true }),
        ])
        setPhuongTienList(phuongTienRes.data)
        setHoKhauList(hoKhauRes.data)
        setNhanKhauList(nhanKhauRes.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  // Lấy danh sách nhân khẩu thuộc hộ khẩu được chọn
  const getNhanKhauByHoKhau = (maHoKhau: string) => {
    return nhanKhauList.filter((nk) => nk.hoKhauId === maHoKhau)
  }

  const filteredPhuongTien = phuongTienList.filter(
    (phuongTien) =>
      phuongTien.maPhuongTien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phuongTien.bienSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phuongTien.tenChuXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hoKhauList.find((hk) => hk.maHoKhau === phuongTien.maHoKhau)?.tenChuHo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPhuongTien((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Reset tên chủ xe khi thay đổi hộ khẩu
    if (name === "maHoKhau") {
      setNewPhuongTien((prev) => ({
        ...prev,
        maHoKhau: value,
        tenChuXe: "", // Reset tên chủ xe
      }))
    }
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrPhuongTien((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (updateErrors[name]) {
      setUpdateErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Reset tên chủ xe khi thay đổi hộ khẩu
    if (name === "maHoKhau") {
      setCurrPhuongTien((prev) => ({
        ...prev,
        maHoKhau: value,
        tenChuXe: "", // Reset tên chủ xe
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const formErrors = validateForm(newPhuongTien, validationRules)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsDialogOpen(false)
    try {
      const response = await apiClient.post(ADD_PHUONGTIEN_ROUTE, newPhuongTien, { withCredentials: true })
      if (response.status === 201) {
        setPhuongTienList([...phuongTienList, response.data])
        setNewPhuongTien({
          maPhuongTien: "",
          maHoKhau: "",
          loaiXe: "Xe máy",
          bienSo: "",
          tenChuXe: "",
          ngayDangKy: new Date().toISOString().split("T")[0],
          ghiChu: "",
        })
        setErrors({})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (maPhuongTien: string) => {
    // Validate form
    const formErrors = validateForm(currPhuongTien, validationRules)
    if (Object.keys(formErrors).length > 0) {
      setUpdateErrors(formErrors)
      return
    }

    try {
      const response = await apiClient.put(`${PUT_PHUONGTIEN_ROUTE}/${maPhuongTien}`, currPhuongTien, {
        withCredentials: true,
      })
      if (response.status === 200) {
        setPhuongTienList((prev) =>
          prev.map((item) => (item.maPhuongTien === maPhuongTien ? { ...item, ...currPhuongTien } : item)),
        )
        setIsUpdateDialogOpen(false)
        setUpdateErrors({})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (maPhuongTien: string) => {
    try {
      const response = await apiClient.delete(`${DELETE_PHUONGTIEN_ROUTE}/${maPhuongTien}`, { withCredentials: true })
      if (response.status === 200) {
        setPhuongTienList(phuongTienList.filter((item) => item.maPhuongTien !== maPhuongTien))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const xeMayCount = phuongTienList.filter((pt) => pt.loaiXe === "Xe máy").length
  const otoCount = phuongTienList.filter((pt) => pt.loaiXe === "Ô tô").length
  const tongPhiHangThang = xeMayCount * 70000 + otoCount * 1200000

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Phương tiện</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Đăng ký phương tiện
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Đăng ký phương tiện mới</DialogTitle>
                <DialogDescription>Nhập thông tin phương tiện mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    id="maPhuongTien"
                    name="maPhuongTien"
                    label="Mã phương tiện"
                    value={newPhuongTien.maPhuongTien || ""}
                    onChange={handleInputChange}
                    required
                    error={errors.maPhuongTien}
                    placeholder="Nhập mã phương tiện"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maHoKhau" className="text-right">
                    Hộ khẩu
                  </Label>
                  <select
                    id="maHoKhau"
                    name="maHoKhau"
                    value={newPhuongTien.maHoKhau}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Chọn hộ khẩu</option>
                    {hoKhauList.map((hoKhau) => (
                      <option key={hoKhau.maHoKhau} value={hoKhau.maHoKhau}>
                        {hoKhau.tenChuHo} - {hoKhau.maHoKhau}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loaiXe" className="text-right">
                    Loại xe
                  </Label>
                  <select
                    id="loaiXe"
                    name="loaiXe"
                    value={newPhuongTien.loaiXe}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="Xe máy">Xe máy</option>
                    <option value="Ô tô">Ô tô</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    id="bienSo"
                    name="bienSo"
                    label="Biển số"
                    value={newPhuongTien.bienSo || ""}
                    onChange={handleInputChange}
                    required
                    error={errors.bienSo}
                    placeholder="Nhập biển số xe"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenChuXe" className="text-right">
                    Chủ xe
                  </Label>
                  {newPhuongTien.maHoKhau ? (
                    <select
                      id="tenChuXe"
                      name="tenChuXe"
                      value={newPhuongTien.tenChuXe}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Chọn chủ xe</option>
                      {getNhanKhauByHoKhau(newPhuongTien.maHoKhau).map((nhanKhau) => (
                        <option key={nhanKhau.maNhanKhau} value={nhanKhau.hoTen}>
                          {nhanKhau.hoTen} - {nhanKhau.quanHe || "Thành viên"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="col-span-3 flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground items-center">
                      Vui lòng chọn hộ khẩu trước
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayDangKy" className="text-right">
                    Ngày đăng ký
                  </Label>
                  <Input
                    id="ngayDangKy"
                    name="ngayDangKy"
                    type="date"
                    value={newPhuongTien.ngayDangKy}
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
                    value={newPhuongTien.ghiChu}
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
                <DialogTitle>Cập nhật thông tin phương tiện</DialogTitle>
                <DialogDescription>Nhập thông tin cập nhật vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    id="maPhuongTien"
                    name="maPhuongTien"
                    label="Mã phương tiện"
                    value={currPhuongTien.maPhuongTien || ""}
                    onChange={handleInputChange}
                    required
                    error={updateErrors.maPhuongTien}
                    placeholder="Nhập mã phương tiện"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maHoKhau" className="text-right">
                    Hộ khẩu
                  </Label>
                  <select
                    id="maHoKhau"
                    name="maHoKhau"
                    value={currPhuongTien.maHoKhau}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Chọn hộ khẩu</option>
                    {hoKhauList.map((hoKhau) => (
                      <option key={hoKhau.maHoKhau} value={hoKhau.maHoKhau}>
                        {hoKhau.tenChuHo} - {hoKhau.maHoKhau}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loaiXe" className="text-right">
                    Loại xe
                  </Label>
                  <select
                    id="loaiXe"
                    name="loaiXe"
                    value={currPhuongTien.loaiXe}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="Xe máy">Xe máy</option>
                    <option value="Ô tô">Ô tô</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    id="bienSo"
                    name="bienSo"
                    label="Biển số"
                    value={currPhuongTien.bienSo || ""}
                    onChange={handleInputChange}
                    required
                    error={updateErrors.bienSo}
                    placeholder="Nhập biển số xe"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenChuXe" className="text-right">
                    Chủ xe
                  </Label>
                  {currPhuongTien.maHoKhau ? (
                    <select
                      id="tenChuXe"
                      name="tenChuXe"
                      value={currPhuongTien.tenChuXe}
                      onChange={handleUpdateInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Chọn chủ xe</option>
                      {getNhanKhauByHoKhau(currPhuongTien.maHoKhau).map((nhanKhau) => (
                        <option key={nhanKhau.maNhanKhau} value={nhanKhau.hoTen}>
                          {nhanKhau.hoTen} - {nhanKhau.quanHe || "Thành viên"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="col-span-3 flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground items-center">
                      Vui lòng chọn hộ khẩu trước
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayDangKy" className="text-right">
                    Ngày đăng ký
                  </Label>
                  <Input
                    id="ngayDangKy"
                    name="ngayDangKy"
                    type="date"
                    value={currPhuongTien.ngayDangKy}
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
                    value={currPhuongTien.ghiChu}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleUpdate(currPhuongTien.maPhuongTien!)}>Cập nhật</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số xe máy</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{xeMayCount}</div>
            <p className="text-xs text-muted-foreground">70.000 VND/xe/tháng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số ô tô</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{otoCount}</div>
            <p className="text-xs text-muted-foreground">1.200.000 VND/xe/tháng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng phí hàng tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tongPhiHangThang.toLocaleString("vi-VN")} VND</div>
            <p className="text-xs text-muted-foreground">Dự kiến thu mỗi tháng</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã, biển số, tên chủ xe hoặc hộ khẩu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã PT</TableHead>
              <TableHead>Hộ khẩu</TableHead>
              <TableHead>Loại xe</TableHead>
              <TableHead>Biển số</TableHead>
              <TableHead>Chủ xe</TableHead>
              <TableHead>Ngày đăng ký</TableHead>
              <TableHead>Phí/tháng</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPhuongTien.length > 0 ? (
              filteredPhuongTien.map((phuongTien) => (
                <TableRow key={phuongTien.maPhuongTien}>
                  <TableCell className="font-medium">{phuongTien.maPhuongTien}</TableCell>
                  <TableCell>
                    {hoKhauList.find((hk) => hk.maHoKhau === phuongTien.maHoKhau)?.tenChuHo || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {phuongTien.loaiXe === "Xe máy" ? (
                        <Bike className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Car className="h-4 w-4 text-green-500" />
                      )}
                      {phuongTien.loaiXe}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{phuongTien.bienSo}</TableCell>
                  <TableCell>{phuongTien.tenChuXe}</TableCell>
                  <TableCell>{new Date(phuongTien.ngayDangKy).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{phuongTien.loaiXe === "Xe máy" ? "70.000 VND" : "1.200.000 VND"}</TableCell>
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
                            setCurrPhuongTien({
                              maPhuongTien: phuongTien.maPhuongTien,
                              maHoKhau: phuongTien.maHoKhau,
                              loaiXe: phuongTien.loaiXe,
                              bienSo: phuongTien.bienSo,
                              tenChuXe: phuongTien.tenChuXe,
                              ngayDangKy: new Date(phuongTien.ngayDangKy).toISOString().split("T")[0],
                              ghiChu: phuongTien.ghiChu,
                            })
                            setIsUpdateDialogOpen(true)
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(phuongTien.maPhuongTien)}
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
                  Không tìm thấy phương tiện nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
