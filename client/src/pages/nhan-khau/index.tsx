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
import { FormField } from "@/components/ui/form-field"
import { Plus, MoreHorizontal, Search, MapPin } from "lucide-react"
import type { NhanKhau } from "@/types"
import { apiClient } from "@/lib/api-client"
import {
  ADD_NHANKHAU_ROUTE,
  GET_ALL_NHANKHAU_ROUTE,
  PUT_NHANKHAU_ROUTE,
  DELETE_NHANKHAU_ROUTE,
  GET_ALL_TTTV_ROUTE,
} from "@/utils/constant"
import { ValidationRules, validateForm } from "@/utils/validation"
import type { TamTruTamVang } from "@/types"

export function NhanKhauPage() {
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({})

  const [currNhanKhau, setCurrNhanKhau] = useState<Partial<NhanKhau>>({
    maNhanKhau: "",
    hoTen: "",
    ngaySinh: new Date().toISOString().split("T")[0],
    gioiTinh: "Nam",
    cccd: "",
  })

  const [newNhanKhau, setNewNhanKhau] = useState<Partial<NhanKhau>>({
    maNhanKhau: "",
    hoTen: "",
    ngaySinh: new Date().toISOString().split("T")[0],
    gioiTinh: "Nam",
    cccd: "",
  })

  const [tttvList, setTttvList] = useState<TamTruTamVang[]>([])

  // Validation rules
  const validationRules = {
    maNhanKhau: {
      required: true,
      label: "Mã nhân khẩu",
      validation: ValidationRules.code,
    },
    hoTen: {
      required: true,
      label: "Họ tên",
      validation: ValidationRules.fullName,
    },
    cccd: {
      required: true,
      label: "CCCD",
      validation: ValidationRules.cccd,
    },
  }

  useEffect(() => {
    const getAllData = async () => {
      try {
        const [nhanKhauRes, tttvRes] = await Promise.all([
          apiClient.get(GET_ALL_NHANKHAU_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_TTTV_ROUTE, { withCredentials: true }),
        ])
        setNhanKhauList(nhanKhauRes.data)
        setTttvList(tttvRes.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllData()
  }, [])

  const getTamVangInfo = (maNhanKhau: string) => {
    const today = new Date()
    return tttvList.find(
      (item) =>
        item.nhanKhauId === maNhanKhau &&
        item.loai === "Tạm vắng" &&
        new Date(item.tuNgay) <= today &&
        new Date(item.denNgay) >= today,
    )
  }

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrNhanKhau((prev) => ({
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const formErrors = validateForm(newNhanKhau, validationRules)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsDialogOpen(false)
    try {
      const response = await apiClient.post(ADD_NHANKHAU_ROUTE, newNhanKhau, { withCredentials: true })
      if (response.status == 201) {
        console.log("Thêm nhân khẩu mới thành công")
        // Reset form
        setNewNhanKhau({
          maNhanKhau: "",
          hoTen: "",
          ngaySinh: new Date().toISOString().split("T")[0],
          gioiTinh: "Nam",
          cccd: "",
        })
        setErrors({})
        setNhanKhauList((prev) => [...prev, response.data])
      }
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (maNhanKhau: string) => {
    // Validate form
    const formErrors = validateForm(currNhanKhau, validationRules)
    if (Object.keys(formErrors).length > 0) {
      setUpdateErrors(formErrors)
      return
    }

    try {
      const response = await apiClient.put(`${PUT_NHANKHAU_ROUTE}/${maNhanKhau}`, currNhanKhau, {
        withCredentials: true,
      })
      if (response.status == 200) {
        setNhanKhauList((prev) =>
          prev.map((item) => (item.maNhanKhau === currNhanKhau.maNhanKhau ? { ...item, ...currNhanKhau } : item)),
        )
        setIsUpdateDialogOpen(false)
        setUpdateErrors({})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (maNhanKhau: string) => {
    try {
      const response = await apiClient.delete(`${DELETE_NHANKHAU_ROUTE}/${maNhanKhau}`, { withCredentials: true })
      if (response.status == 200) {
        console.log("Xóa nhân khẩu thành công")
        setNhanKhauList((prev) => prev.filter((nhanKhau) => nhanKhau.maNhanKhau !== maNhanKhau))
      }
    } catch (error) {
      console.log(error)
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
                <FormField
                  id="maNhanKhau"
                  name="maNhanKhau"
                  label="Mã nhân khẩu"
                  value={newNhanKhau.maNhanKhau || ""}
                  onChange={handleInputChange}
                  required
                  error={errors.maNhanKhau}
                  placeholder="Nhập mã nhân khẩu"
                />

                <FormField
                  id="hoTen"
                  name="hoTen"
                  label="Họ tên"
                  value={newNhanKhau.hoTen || ""}
                  onChange={handleInputChange}
                  required
                  error={errors.hoTen}
                  placeholder="Nhập họ và tên"
                />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngaySinh" className="text-right">
                    Ngày sinh <span className="text-destructive">*</span>
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
                    Giới tính <span className="text-destructive">*</span>
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

                <FormField
                  id="cccd"
                  name="cccd"
                  label="CCCD"
                  value={newNhanKhau.cccd || ""}
                  onChange={handleInputChange}
                  required
                  error={errors.cccd}
                  placeholder="Nhập số CCCD (12 chữ số)"
                />
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
                <DialogTitle>Cập nhật thông tin nhân khẩu</DialogTitle>
                <DialogDescription>Nhập thông tin cập nhật vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  id="maNhanKhau"
                  name="maNhanKhau"
                  label="Mã nhân khẩu"
                  value={currNhanKhau.maNhanKhau || ""}
                  onChange={handleUpdateInputChange}
                  disabled
                  required
                />

                <FormField
                  id="hoTen"
                  name="hoTen"
                  label="Họ tên"
                  value={currNhanKhau.hoTen || ""}
                  onChange={handleUpdateInputChange}
                  required
                  error={updateErrors.hoTen}
                  placeholder="Nhập họ và tên"
                />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngaySinh" className="text-right">
                    Ngày sinh <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ngaySinh"
                    name="ngaySinh"
                    type="date"
                    value={currNhanKhau.ngaySinh}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gioiTinh" className="text-right">
                    Giới tính <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="gioiTinh"
                    name="gioiTinh"
                    value={currNhanKhau.gioiTinh}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <FormField
                  id="cccd"
                  name="cccd"
                  label="CCCD"
                  value={currNhanKhau.cccd || ""}
                  onChange={handleUpdateInputChange}
                  required
                  error={updateErrors.cccd}
                  placeholder="Nhập số CCCD (12 chữ số)"
                />
              </div>
              <DialogFooter>
                <Button onClick={() => handleUpdate(currNhanKhau.maNhanKhau!)}>Cập nhật</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-500" />
          <div>
            <h3 className="font-medium text-orange-800">Thông báo tạm vắng</h3>
            <p className="text-sm text-orange-600">
              Hiện có{" "}
              <span className="font-semibold">{nhanKhauList.filter((nk) => getTamVangInfo(nk.maNhanKhau)).length}</span>{" "}
              nhân khẩu đang trong trạng thái tạm vắng
              {nhanKhauList.filter((nk) => getTamVangInfo(nk.maNhanKhau)).length > 0 && (
                <span className="ml-2">
                  (
                  {nhanKhauList
                    .filter((nk) => getTamVangInfo(nk.maNhanKhau))
                    .map((nk) => nk.hoTen)
                    .join(", ")}
                  )
                </span>
              )}
            </p>
          </div>
        </div>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {nhanKhau.hoTen}
                      {getTamVangInfo(nhanKhau.maNhanKhau) && (
                        <div className="relative group">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-black text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                            {(() => {
                              const tamVang = getTamVangInfo(nhanKhau.maNhanKhau)
                              return tamVang
                                ? `Tạm vắng từ ngày ${new Date(tamVang.tuNgay).toLocaleDateString("vi-VN")} đến ngày ${new Date(tamVang.denNgay).toLocaleDateString("vi-VN")}`
                                : ""
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
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
                      <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md !bg-opacity-100">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrNhanKhau({
                              maNhanKhau: nhanKhau.maNhanKhau,
                              hoTen: nhanKhau.hoTen,
                              ngaySinh: new Date(nhanKhau.ngaySinh).toISOString().split("T")[0],
                              gioiTinh: nhanKhau.gioiTinh,
                              cccd: nhanKhau.cccd,
                            })
                            setUpdateErrors({})
                            setIsUpdateDialogOpen(true)
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
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
