"use client"

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Input } from "@/components/ui/input"
import { ChevronLeft, UserPlus, UserMinus } from "lucide-react"
import type { HoKhau, NhanKhau } from "@/types"

// Mock data
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
}

const mockNhanKhau: NhanKhau[] = [
  {
    id: "1",
    maNhanKhau: "NK001",
    hoTen: "Nguyễn Văn A",
    ngaySinh: "1980-05-15",
    gioiTinh: "Nam",
    cccd: "012345678901",
    hoKhauId: "1",
    quanHe: "Chủ hộ",
  },
  {
    id: "2",
    maNhanKhau: "NK002",
    hoTen: "Nguyễn Thị X",
    ngaySinh: "1985-08-20",
    gioiTinh: "Nữ",
    cccd: "012345678902",
    hoKhauId: "1",
    quanHe: "Vợ",
  },
  {
    id: "3",
    maNhanKhau: "NK003",
    hoTen: "Nguyễn Văn Y",
    ngaySinh: "2010-03-10",
    gioiTinh: "Nam",
    cccd: "012345678903",
    hoKhauId: "1",
    quanHe: "Con",
  },
  {
    id: "4",
    maNhanKhau: "NK004",
    hoTen: "Nguyễn Thị Z",
    ngaySinh: "2015-12-25",
    gioiTinh: "Nữ",
    cccd: "012345678904",
    hoKhauId: "1",
    quanHe: "Con",
  },
]

export function HoKhauDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [hoKhau, setHoKhau] = useState<HoKhau | null>(null)
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [availableNhanKhau, setAvailableNhanKhau] = useState<NhanKhau[]>([])
  const [selectedNhanKhauId, setSelectedNhanKhauId] = useState<string>("")
  const [quanHe, setQuanHe] = useState<string>("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editHoKhau, setEditHoKhau] = useState<HoKhau | null>(null)

  useEffect(() => {
    if (id) {
      setHoKhau(mockHoKhau[id])
      setNhanKhauList(mockNhanKhau.filter((nk) => nk.hoKhauId === id))
      setAvailableNhanKhau(mockNhanKhau.filter((nk) => !nk.hoKhauId))
    }
  }, [id])

  const handleOpenEdit = () => {
    setEditHoKhau(hoKhau)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editHoKhau) {
      setHoKhau(editHoKhau)
      // Cập nhật tên chủ hộ trong danh sách nhân khẩu
      setNhanKhauList(list =>
        list.map(nk =>
          nk.quanHe === "Chủ hộ"
            ? { ...nk, hoTen: editHoKhau.tenChuHo }
            : nk
        )
      )
      setIsEditDialogOpen(false)
    }
  }

  const handleAddNhanKhau = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would update the database
    console.log("Add resident:", { nhanKhauId: selectedNhanKhauId, quanHe })
    setIsAddDialogOpen(false)
    setSelectedNhanKhauId("")
    setQuanHe("")
  }

  const handleRemoveNhanKhau = (nhanKhauId: string) => {
    // In a real app, you would update the database
    console.log("Remove resident:", nhanKhauId)
  }

  if (!hoKhau) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/ho-khau">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Chi tiết Hộ khẩu: {hoKhau?.maHoKhau}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card thông tin hộ khẩu */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Thông tin hộ khẩu</CardTitle>
                <CardDescription>Chi tiết về hộ khẩu và chủ hộ</CardDescription>
              </div>
              <Button
                onClick={handleOpenEdit}
                variant="outline"
                className="ml-2 hover:bg-black hover:text-white"
              >
                Sửa hộ khẩu
              </Button>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Mã hộ khẩu</dt>
                  <dd>{hoKhau.maHoKhau}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tên chủ hộ</dt>
                  <dd>{hoKhau.tenChuHo}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Địa chỉ</dt>
                  <dd>{hoKhau.diaChi}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Số thành viên</dt>
                  <dd>{hoKhau.soThanhVien}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Ngày lập</dt>
                  <dd>{new Date(hoKhau.ngayLap).toLocaleDateString("vi-VN")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Card thành viên hộ khẩu */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Thành viên hộ khẩu</CardTitle>
                <CardDescription>Danh sách nhân khẩu thuộc hộ khẩu này</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="hover:bg-black hover:text-white"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Thêm thành viên
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddNhanKhau}>
                    <DialogHeader>
                      <DialogTitle>Thêm thành viên vào hộ khẩu</DialogTitle>
                      <DialogDescription>Chọn nhân khẩu và mối quan hệ với chủ hộ</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nhanKhau" className="text-right">
                          Nhân khẩu
                        </Label>
                        <select
                          id="nhanKhau"
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedNhanKhauId}
                          onChange={(e) => setSelectedNhanKhauId(e.target.value)}
                          required
                        >
                          <option value="">Chọn nhân khẩu</option>
                          {availableNhanKhau.map((nk) => (
                            <option key={nk.id} value={nk.id}>
                              {nk.hoTen} - {nk.maNhanKhau}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quanHe" className="text-right">
                          Quan hệ với chủ hộ
                        </Label>
                        <Input
                          id="quanHe"
                          value={quanHe}
                          onChange={(e) => setQuanHe(e.target.value)}
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Thêm</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã NK</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Quan hệ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nhanKhauList.length > 0 ? (
                    nhanKhauList.map((nhanKhau) => (
                      <TableRow key={nhanKhau.id}>
                        <TableCell className="font-medium">{nhanKhau.maNhanKhau}</TableCell>
                        <TableCell>{nhanKhau.hoTen}</TableCell>
                        <TableCell>{nhanKhau.quanHe}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveNhanKhau(nhanKhau.id)}
                            disabled={nhanKhau.quanHe === "Chủ hộ"}
                          >
                            <UserMinus className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Xóa thành viên</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Không có thành viên nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog sửa hộ khẩu */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Sửa hộ khẩu</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Mã hộ khẩu</Label>
                <Input value={editHoKhau?.maHoKhau || ""} disabled />
              </div>
              <div>
                <Label>Tên chủ hộ</Label>
                <Input
                  value={editHoKhau?.tenChuHo || ""}
                  onChange={e =>
                    setEditHoKhau(hk => hk ? { ...hk, tenChuHo: e.target.value, id: hk.id } : hk)
                  }
                  required
                />
              </div>
              <div>
                <Label>Địa chỉ</Label>
                <Input
                  value={editHoKhau?.diaChi || ""}
                  onChange={e =>
                    setEditHoKhau(hk => hk ? { ...hk, diaChi: e.target.value, id: hk.id } : hk)
                  }
                  required
                />
              </div>
              <div>
                <Label>Số thành viên</Label>
                <Input
                  type="number"
                  min={1}
                  value={editHoKhau?.soThanhVien || ""}
                  onChange={e =>
                    setEditHoKhau(hk => hk ? { ...hk, soThanhVien: Number(e.target.value), id: hk.id } : hk)
                  }
                  required
                />
              </div>
              <div>
                <Label>Ngày lập</Label>
                <Input
                  type="date"
                  value={editHoKhau?.ngayLap || ""}
                  onChange={e =>
                    setEditHoKhau(hk => hk ? { ...hk, ngayLap: e.target.value, id: hk.id } : hk)
                  }
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
    </>
  )
}