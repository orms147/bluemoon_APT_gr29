"use client"

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
import { MoreHorizontal, Search, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PhiGuiXe, PhuongTien, HoKhau } from "@/types"
import { apiClient } from "@/lib/api-client"
import {
  GET_ALL_PHIGUIXE_ROUTE,
  GET_ALL_PHUONGTIEN_ROUTE,
  GET_ALL_HOKHAU_ROUTE,
  GENERATE_MONTHLY_FEES_ROUTE,
  PAY_VEHICLE_FEE_ROUTE,
  DELETE_PHIGUIXE_ROUTE,
} from "@/utils/constant"

export function PhiGuiXePage() {
  const [phiGuiXeList, setPhiGuiXeList] = useState<PhiGuiXe[]>([])
  const [phuongTienList, setPhuongTienList] = useState<PhuongTien[]>([])
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [phiGuiXeRes, phuongTienRes, hoKhauRes] = await Promise.all([
          apiClient.get(GET_ALL_PHIGUIXE_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_PHUONGTIEN_ROUTE, { withCredentials: true }),
          apiClient.get(GET_ALL_HOKHAU_ROUTE, { withCredentials: true }),
        ])
        setPhiGuiXeList(phiGuiXeRes.data)
        setPhuongTienList(phuongTienRes.data)
        setHoKhauList(hoKhauRes.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const filteredPhiGuiXe = phiGuiXeList.filter((phi) => {
    const phuongTien = phuongTienList.find((pt) => pt.maPhuongTien === phi.maPhuongTien)
    const hoKhau = hoKhauList.find((hk) => hk.maHoKhau === phi.maHoKhau)

    return (
      phi.maPhiGuiXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (phuongTien?.bienSo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (phuongTien?.tenChuXe || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hoKhau?.tenChuHo || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleGenerateMonthlyFees = async () => {
    try {
      const response = await apiClient.post(
        GENERATE_MONTHLY_FEES_ROUTE,
        { thang: selectedMonth, nam: selectedYear },
        { withCredentials: true },
      )
      if (response.status === 201) {
        setPhiGuiXeList([...phiGuiXeList, ...response.data])
        setIsGenerateDialogOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePayFee = async (maPhiGuiXe: string) => {
    try {
      const response = await apiClient.put(`${PAY_VEHICLE_FEE_ROUTE}/${maPhiGuiXe}`, {}, { withCredentials: true })
      if (response.status === 200) {
        setPhiGuiXeList((prev) =>
          prev.map((phi) =>
            phi.maPhiGuiXe === maPhiGuiXe
              ? { ...phi, trangThai: "Đã thu", ngayThu: new Date().toISOString(), nguoiThu: "Admin" }
              : phi,
          ),
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (maPhiGuiXe: string) => {
    try {
      const response = await apiClient.delete(`${DELETE_PHIGUIXE_ROUTE}/${maPhiGuiXe}`, { withCredentials: true })
      if (response.status === 200) {
        setPhiGuiXeList(phiGuiXeList.filter((phi) => phi.maPhiGuiXe !== maPhiGuiXe))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const currentMonthFees = phiGuiXeList.filter((phi) => phi.thang === selectedMonth && phi.nam === selectedYear)
  const totalCurrentMonth = currentMonthFees.reduce((sum, phi) => sum + phi.soTien, 0)
  const paidCurrentMonth = currentMonthFees
    .filter((phi) => phi.trangThai === "Đã thu")
    .reduce((sum, phi) => sum + phi.soTien, 0)
  const unpaidCurrentMonth = totalCurrentMonth - paidCurrentMonth

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Phí gửi xe</h2>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Tạo phí tháng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Tạo phí gửi xe hàng tháng</DialogTitle>
              <DialogDescription>
                Chọn tháng và năm để tạo phí gửi xe cho tất cả phương tiện đã đăng ký
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="month" className="text-right">
                  Tháng
                </Label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Năm
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGenerateMonthlyFees}>Tạo phí</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng phí tháng {selectedMonth}/{selectedYear}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCurrentMonth.toLocaleString("vi-VN")} VND</div>
            <p className="text-xs text-muted-foreground">{currentMonthFees.length} phương tiện</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã thu</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCurrentMonth.toLocaleString("vi-VN")} VND</div>
            <p className="text-xs text-muted-foreground">
              {currentMonthFees.filter((phi) => phi.trangThai === "Đã thu").length} phương tiện
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chưa thu</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unpaidCurrentMonth.toLocaleString("vi-VN")} VND</div>
            <p className="text-xs text-muted-foreground">
              {currentMonthFees.filter((phi) => phi.trangThai === "Chưa thu").length} phương tiện
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCurrentMonth > 0 ? Math.round((paidCurrentMonth / totalCurrentMonth) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã phí, biển số, tên chủ xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Tháng:</Label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <Label>Năm:</Label>
          <Input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã phí</TableHead>
              <TableHead>Hộ khẩu</TableHead>
              <TableHead>Phương tiện</TableHead>
              <TableHead>Biển số</TableHead>
              <TableHead>Tháng/Năm</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày thu</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPhiGuiXe.length > 0 ? (
              filteredPhiGuiXe.map((phi) => {
                const phuongTien = phuongTienList.find((pt) => pt.maPhuongTien === phi.maPhuongTien)
                const hoKhau = hoKhauList.find((hk) => hk.maHoKhau === phi.maHoKhau)

                return (
                  <TableRow key={phi.maPhiGuiXe}>
                    <TableCell className="font-medium">{phi.maPhiGuiXe}</TableCell>
                    <TableCell>{hoKhau?.tenChuHo || "N/A"}</TableCell>
                    <TableCell>{phuongTien?.loaiXe || "N/A"}</TableCell>
                    <TableCell className="font-mono">{phuongTien?.bienSo || "N/A"}</TableCell>
                    <TableCell>
                      {phi.thang}/{phi.nam}
                    </TableCell>
                    <TableCell>{phi.soTien.toLocaleString("vi-VN")} VND</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          phi.trangThai === "Đã thu" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {phi.trangThai}
                      </span>
                    </TableCell>
                    <TableCell>{phi.ngayThu ? new Date(phi.ngayThu).toLocaleDateString("vi-VN") : "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {phi.trangThai === "Chưa thu" && (
                            <DropdownMenuItem onClick={() => handlePayFee(phi.maPhiGuiXe)}>
                              Xác nhận đã thu
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(phi.maPhiGuiXe)}>
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Không tìm thấy phí gửi xe nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
