import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { KhoanThu } from "@/types"

// Mock data
const mockKhoanThu: KhoanThu[] = [
  {
    id: "1",
    maKhoanThu: "KT001",
    tenKhoanThu: "Phí dịch vụ chung cư",
    loai: "Bắt buộc",
    soTien: 700000,
    ngayTao: "2023-01-01",
    ghiChu: "Thu hàng tháng",
  },
  {
    id: "2",
    maKhoanThu: "KT002",
    tenKhoanThu: "Phí gửi xe máy",
    loai: "Bắt buộc",
    soTien: 100000,
    ngayTao: "2023-01-01",
    ghiChu: "Thu hàng tháng",
  },
]

export function KhoanThuPage() {
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>(mockKhoanThu)

  const handleDeleteKhoanThu = (id: string) => {
    setKhoanThuList(list => list.filter(kt => kt.id !== id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Quản lý Khoản thu</h2>
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
            {khoanThuList.length > 0 ? (
              khoanThuList.map((kt) => (
                <TableRow key={kt.id}>
                  <TableCell>{kt.maKhoanThu}</TableCell>
                  <TableCell>{kt.tenKhoanThu}</TableCell>
                  <TableCell>{kt.loai}</TableCell>
                  <TableCell>{kt.soTien?.toLocaleString("vi-VN") || ""}</TableCell>
                  <TableCell>{new Date(kt.ngayTao).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{kt.ghiChu}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteKhoanThu(kt.id)}
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
                  Không có khoản thu nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}