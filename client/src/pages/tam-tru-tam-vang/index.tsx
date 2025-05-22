"use client"

import type React from "react"
import { useState } from "react"
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

// Mock data
const mockTamTruTamVang: TamTruTamVang[] = [
  {
    id: "1",
    maDangKy: "TT001",
    nhanKhauId: "2",
    loai: "Tạm vắng",
    tuNgay: "2023-05-01",
    denNgay: "2023-06-30",
    diaChi: "Hà Nội",
    lyDo: "Công tác",
  },
  {
    id: "2",
    maDangKy: "TT002",
    nhanKhauId: "5",
    loai: "Tạm trú",
    tuNgay: "2023-04-15",
    denNgay: "2023-07-15",
    diaChi: "P.1201, Tòa A, BlueMoon",
    lyDo: "Thăm người thân",
  },
  {
    id: "3",
    maDangKy: "TT003",
    nhanKhauId: "3",
    loai: "Tạm vắng",
    tuNgay: "2023-06-01",
    denNgay: "2023-09-01",
    diaChi: "Đà Nẵng",
    lyDo: "Du học",
  },
]

// Mock data for NhanKhau
const mockNhanKhau: Record<string, NhanKhau> = {
  "1": {
    id: "1",
    maNhanKhau: "NK001",
    hoTen: "Nguyễn Văn A",
    ngaySinh: "1980-05-15",
    gioiTinh: "Nam",
    cccd: "012345678901",
    hoKhauId: "1",
    quanHe: "Chủ hộ",
  },
  "2": {
    id: "2",
    maNhanKhau: "NK002",
    hoTen: "Nguyễn Thị X",
    ngaySinh: "1985-08-20",
    gioiTinh: "Nữ",
    cccd: "012345678902",
    hoKhauId: "1",
    quanHe: "Vợ",
  },
  "3": {
    id: "3",
    maNhanKhau: "NK003",
    hoTen: "Nguyễn Văn Y",
    ngaySinh: "2010-03-10",
    gioiTinh: "Nam",
    cccd: "012345678903",
    hoKhauId: "1",
    quanHe: "Con",
  },
  "5": {
    id: "5",
    maNhanKhau: "NK005",
    hoTen: "Trần Thị B",
    ngaySinh: "1975-11-30",
    gioiTinh: "Nữ",
    cccd: "012345678905",
    hoKhauId: "2",
    quanHe: "Chủ hộ",
  },
}



export function TamTruTamVangPage() {
  const [tamTruTamVangList, setTamTruTamVangList] = useState<TamTruTamVang[]>(mockTamTruTamVang)
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

  const filteredTamTruTamVang = tamTruTamVangList.filter(
    (tamTruTamVang) =>
      tamTruTamVang.maDangKy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mockNhanKhau[tamTruTamVang.nhanKhauId]?.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTamTruTamVangList(prev => [
      ...prev,
      {
        ...newTamTruTamVang,
        id: (prev.length + 1).toString(),
      } as TamTruTamVang,
    ])
    setIsDialogOpen(false)
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
                <TableRow key={tamTruTamVang.id}>
                  <TableCell className="font-medium">{tamTruTamVang.maDangKy}</TableCell>
                  <TableCell>{mockNhanKhau[tamTruTamVang.nhanKhauId]?.hoTen || "N/A"}</TableCell>
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
                          onClick={() => handleDeleteTamTruTamVang(tamTruTamVang.id)}
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
