"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { KhoanThu } from "@/types"
import { apiClient } from '@/lib/api-client'
import { GET_ALL_KHOANTHU_ROUTE, ADD_KHOANTHU_ROUTE, DELETE_KHOANTHU_ROUTE } from '@/utils/constant'

export function KhoanThuPage() {
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newKhoanThu, setNewKhoanThu] = useState<Partial<KhoanThu>>({
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
        {withCrediental: true},
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
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
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