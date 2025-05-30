"use client"

import * as React from "react"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Plus, MoreHorizontal, Search } from "lucide-react"
import type { PhieuNopTien, KhoanThu, HoKhau } from "@/types"
import { apiClient } from "@/lib/api-client"
import {
  GET_ALL_HOKHAU_ROUTE,
  GET_ALL_KHOANTHU_ROUTE,
  GET_ALL_PHIEUNOP_ROUTE,
  ADD_PHIEUNOP_ROUTE,
  PUT_PHIEUNOP_ROUTE,
  DELETE_PHIEUNOP_ROUTE,
} from "@/utils/constant"

export function ThuPhiPage() {
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([])
  const [phieuNopTienList, setPhieuNopTienList] = useState<PhieuNopTien[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedPhieuNopTien, setSelectedPhieuNopTien] = useState<Partial<PhieuNopTien>>({
    maPhieu: "",
    maKhoanThu: "",
    maHoKhau: "",
    nguoiNop: "",
    soTien: 0,
    ngayNop: new Date().toISOString().split("T")[0],
    nguoiThu: "Admin",
    ghiChu: "",
    daThu: false
  })
  const [newPhieuNopTien, setNewPhieuNopTien] = useState<Partial<PhieuNopTien>>({
    maPhieu: "",
    maKhoanThu: "",
    maHoKhau: "",
    nguoiNop: "",
    soTien: 0,
    ngayNop: new Date().toISOString().split("T")[0],
    nguoiThu: "Admin",
    ghiChu: "",
    daThu: false
  })

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hoKhauRes, khoanThuRes, phieuNopRes] = await Promise.all([
          apiClient.get(GET_ALL_HOKHAU_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_KHOANTHU_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_PHIEUNOP_ROUTE, { withCredentials: true }),
        ])
        setHoKhauList(hoKhauRes.data)
        setKhoanThuList(khoanThuRes.data)
        setPhieuNopTienList(phieuNopRes.data)
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu:", error)
      }
    }
    fetchData()
  }, [])

  const filteredPhieuNopTien = phieuNopTienList.filter(
    (phieu) =>
      phieu.maPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hoKhauList.find((hk) => hk.maHoKhau === phieu.maHoKhau)?.tenChuHo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (khoanThuList.find((kt) => kt.maKhoanThu === phieu.maKhoanThu)?.tenKhoanThu || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setNewPhieuNopTien((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
              name === "soTien" ? Number.parseInt(value) : value,
    }))
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setSelectedPhieuNopTien((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
              name === "soTien" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)
    try {
      const response = await apiClient.post(ADD_PHIEUNOP_ROUTE, newPhieuNopTien, { withCredentials: true })
      if (response.status === 201) {
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
          daThu: false
        })
        setPhieuNopTienList([...phieuNopTienList, response.data])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (maPhieu: string) => {
    try {
      const response = await apiClient.put(
        `${PUT_PHIEUNOP_ROUTE}/${maPhieu}`,
        selectedPhieuNopTien,
        { withCredentials: true }
      )
      if (response.status === 200) {
        setPhieuNopTienList((prev) =>
          prev.map((phieuNop) =>
            phieuNop.maPhieu === maPhieu ? { ...phieuNop, ...selectedPhieuNopTien } : phieuNop
          )
        )
        setIsUpdateDialogOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (maPhieu: string) => {
    try {
      const response = await apiClient.delete(`${DELETE_PHIEUNOP_ROUTE}/${maPhieu}`, { withCredentials: true })
      if (response.status === 200) {
        setPhieuNopTienList((prev) => prev.filter((phieuNop) => phieuNop.maPhieu !== maPhieu))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Hàm in phiếu thu và cập nhật trạng thái "Đã thu"
  const handlePrintPhieu = (maPhieu: string) => {
    const selectedPhieu = phieuNopTienList.find((p) => p.maPhieu === maPhieu)
    if (selectedPhieu) {
      // Mở cửa sổ mới chỉ chứa thông tin của phiếu được chọn để in
      const printWindow = window.open("", "PrintWindow", "width=600,height=600")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Phiếu thu</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .info { margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <h1>Phiếu thu</h1>
              <div class="info"><strong>Mã phiếu:</strong> ${selectedPhieu.maPhieu}</div>
              <div class="info"><strong>Khoản thu:</strong> ${selectedPhieu.maKhoanThu}</div>
              <div class="info"><strong>Hộ khẩu:</strong> ${selectedPhieu.maHoKhau}</div>
              <div class="info"><strong>Người nộp:</strong> ${selectedPhieu.nguoiNop}</div>
              <div class="info"><strong>Số tiền:</strong> ${selectedPhieu.soTien.toLocaleString("vi-VN")} VND</div>
              <div class="info"><strong>Ngày nộp:</strong> ${new Date(selectedPhieu.ngayNop).toLocaleDateString("vi-VN")}</div>
              <div class="info"><strong>Người thu:</strong> ${selectedPhieu.nguoiThu}</div>
              <div class="info"><strong>Ghi chú:</strong> ${selectedPhieu.ghiChu}</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }

      // Sau khi in, cập nhật trạng thái "Đã thu"
      setPhieuNopTienList((prev) =>
        prev.map((phieu) =>
          phieu.maPhieu === maPhieu ? { ...phieu, daThu: true } : phieu
        )
      )
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
                <DialogDescription>
                  Nhập thông tin phiếu nộp tiền mới vào form bên dưới
                </DialogDescription>
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
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="daThu" className="text-right">
                    Xác nhận đã thu
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="daThu"
                      name="daThu"
                      checked={newPhieuNopTien.daThu}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-muted-foreground">
                      Đánh dấu nếu đã thu tiền
                    </span>
                  </div>
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
                <DialogTitle>Cập nhật phiếu nộp tiền</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật vào form bên dưới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maPhieu" className="text-right">
                    Mã phiếu
                  </Label>
                  <Input
                    id="maPhieu"
                    name="maPhieu"
                    value={selectedPhieuNopTien.maPhieu}
                    disabled
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
                    value={selectedPhieuNopTien.maKhoanThu}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    value={selectedPhieuNopTien.maHoKhau}
                    onChange={handleUpdateInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    value={selectedPhieuNopTien.nguoiNop}
                    onChange={handleUpdateInputChange}
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
                    value={selectedPhieuNopTien.soTien}
                    onChange={handleUpdateInputChange}
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
                    value={selectedPhieuNopTien.ngayNop}
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
                    value={selectedPhieuNopTien.ghiChu}
                    onChange={handleUpdateInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="daThu" className="text-right">
                    Xác nhận đã thu
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="daThu"
                      name="daThu"
                      checked={selectedPhieuNopTien.daThu}
                      onChange={handleUpdateInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-muted-foreground">
                      Đánh dấu nếu đã thu tiền
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleUpdate(selectedPhieuNopTien.maPhieu!)}>
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
                  <TableCell>
                    {khoanThuList.find((khoanThu) => khoanThu.maKhoanThu == phieu.maKhoanThu)?.tenKhoanThu || "N/A"}
                  </TableCell>
                  <TableCell>
                    {hoKhauList.find((hoKhau) => hoKhau.maHoKhau == phieu.maHoKhau)?.tenChuHo || "N/A"}
                  </TableCell>
                  <TableCell>{phieu.nguoiNop}</TableCell>
                  <TableCell>{phieu.soTien.toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell>{new Date(phieu.ngayNop).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    {phieu.nguoiThu}
                    {phieu.daThu ? " (Đã thu)" : ""}
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
                        <DropdownMenuItem onClick={() => handlePrintPhieu(phieu.maPhieu)}>
                          In phiếu thu
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPhieuNopTien({
                              maPhieu: phieu.maPhieu,
                              maKhoanThu: phieu.maKhoanThu,
                              maHoKhau: phieu.maHoKhau,
                              nguoiNop: phieu.nguoiNop,
                              soTien: phieu.soTien,
                              ngayNop: new Date(phieu.ngayNop).toISOString().split("T")[0],
                              nguoiThu: "Admin",
                              ghiChu: phieu.ghiChu,
                              daThu: phieu.daThu
                            })
                            setIsUpdateDialogOpen(true)
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
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