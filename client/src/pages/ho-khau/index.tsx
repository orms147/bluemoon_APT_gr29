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
import { Plus, MoreHorizontal, Search } from 'lucide-react'
import type { HoKhau } from "@/types"
import { ADD_HOKHAU_ROUTE, DELETE_HOKHAU_ROUTE, GET_ALL_HOKHAU_ROUTE, PUT_HOKHAU_ROUTE, PUT_KHOANTHU_ROUTE } from "@/utils/constant"
import { apiClient } from "@/lib/api-client"

export function HoKhauPage() {
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [newHoKhau, setNewHoKhau] = useState<Partial<HoKhau>>({
    maHoKhau: "",
    tenChuHo: "",
    diaChi: "",
    soThanhVien: 1,
    ngayLap: new Date().toISOString().split("T")[0],
  })
  const [currHoKhau, setCurrHoKhau] = useState<Partial<HoKhau>>({
    maHoKhau: "",
    tenChuHo: "",
    diaChi: "",
    soThanhVien: 1,
    ngayLap: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const getListHoKhau = async () => {
      const response = await apiClient.get(GET_ALL_HOKHAU_ROUTE, {withCredentials: true})
      setHoKhauList(response.data)
    }
    getListHoKhau()
    
  }, [])
 
  const filteredHoKhau = hoKhauList.filter(
    (hoKhau) =>
      hoKhau.maHoKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoKhau.tenChuHo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoKhau.diaChi.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewHoKhau((prev) => ({
      ...prev,
      [name]: name === "soThanhVien" ? Number.parseInt(value) : value,
    }))
  }

  const handleCurrHoKhauInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrHoKhau((prev) => ({
      ...prev,
      [name]: name === "soThanhVien" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)

    try {
      const response = await apiClient.post(
        ADD_HOKHAU_ROUTE,
        newHoKhau,
        {withCredentials: true},
      )
      if (response.status === 201){
        console.log("New household added successfully");
        // Reset form
        setNewHoKhau({
          maHoKhau: "",
          tenChuHo: "",
          diaChi: "",
          soThanhVien: 1,
          ngayLap: new Date().toISOString().split("T")[0],
        })
        setHoKhauList([...hoKhauList, response.data])
      } 
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  }
 
  const handleUpdate = async (maHoKhau: string) => {
    try {
      const response = await apiClient.put(
        `${PUT_HOKHAU_ROUTE}/${maHoKhau}`,
        currHoKhau,
        {withCredentials: true}
      )
      if (response.status === 200) {
        setHoKhauList((prevList) =>
          prevList.map((item) =>
            item.maHoKhau === currHoKhau.maHoKhau ? { ...item, ...currHoKhau } : item
          )
        )
        setIsUpdateDialogOpen(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (maHoKhau: string) => {
    try {
      const response = await apiClient.delete(
        `${DELETE_HOKHAU_ROUTE}/${maHoKhau}`,
        {withCredentials: true},
      )
      if (response.status === 200){
        console.log("Xóa hộ khẩu thành công");
        setHoKhauList(hoKhauList.filter((hoKhau) => hoKhau.maHoKhau !== maHoKhau))
      } 
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Hộ khẩu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm hộ khẩu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
                <DialogDescription>Nhập thông tin hộ khẩu mới vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maHoKhau" className="text-right">
                    Mã hộ khẩu
                  </Label>
                  <Input
                    id="maHoKhau"
                    name="maHoKhau"
                    value={newHoKhau.maHoKhau}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenChuHo" className="text-right">
                    Tên chủ hộ
                  </Label>
                  <Input
                    id="tenChuHo"
                    name="tenChuHo"
                    value={newHoKhau.tenChuHo}
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
                    value={newHoKhau.diaChi}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soThanhVien" className="text-right">
                    Số thành viên
                  </Label>
                  <Input
                    id="soThanhVien"
                    name="soThanhVien"
                    type="number"
                    min="1"
                    value={newHoKhau.soThanhVien}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayLap" className="text-right">
                    Ngày lập
                  </Label>
                  <Input
                    id="ngayLap"
                    name="ngayLap"
                    type="date"
                    value={newHoKhau.ngayLap}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={(e) => {
              e.preventDefault();
            }}>
              <DialogHeader>
                <DialogTitle>Cập nhật thông tin hộ khẩu</DialogTitle>
                <DialogDescription>Nhập thông tin cập nhật vào form bên dưới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maHoKhau" className="text-right">
                    Mã hộ khẩu
                  </Label>
                  <Input
                    id="maHoKhau"
                    name="maHoKhau"
                    value={currHoKhau.maHoKhau}
                    disabled
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tenChuHo" className="text-right">
                    Tên chủ hộ
                  </Label>
                  <Input
                    id="tenChuHo"
                    name="tenChuHo"
                    value={currHoKhau.tenChuHo}
                    onChange={handleCurrHoKhauInputChange}
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
                    value={currHoKhau.diaChi}
                    onChange={handleCurrHoKhauInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soThanhVien" className="text-right">
                    Số thành viên
                  </Label>
                  <Input
                    id="soThanhVien"
                    name="soThanhVien"
                    type="number"
                    min="1"
                    value={currHoKhau.soThanhVien}
                    onChange={handleCurrHoKhauInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ngayLap" className="text-right">
                    Ngày lập
                  </Label>
                  <Input
                    id="ngayLap"
                    name="ngayLap"
                    type="date"
                    value={currHoKhau.ngayLap}
                    onChange={handleCurrHoKhauInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick = {() => handleUpdate(currHoKhau.maHoKhau!)}
                >
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
          placeholder="Tìm kiếm theo mã, tên chủ hộ hoặc địa chỉ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hộ khẩu</TableHead>
              <TableHead>Tên chủ hộ</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Số thành viên</TableHead>
              <TableHead>Ngày lập</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHoKhau.length > 0 ? (
              filteredHoKhau.map((hoKhau) => (
                <TableRow key={hoKhau.maHoKhau}>
                  <TableCell className="font-medium">{hoKhau.maHoKhau}</TableCell>
                  <TableCell>{hoKhau.tenChuHo}</TableCell>
                  <TableCell>{hoKhau.diaChi}</TableCell>
                  <TableCell>{hoKhau.soThanhVien}</TableCell>
                  <TableCell>{new Date(hoKhau.ngayLap).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/ho-khau/${hoKhau.maHoKhau}`}>Xem chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {                            
                            setCurrHoKhau(
                              {
                                maHoKhau: hoKhau.maHoKhau,
                                tenChuHo: hoKhau.tenChuHo,
                                diaChi: hoKhau.diaChi,
                                soThanhVien: hoKhau.soThanhVien,
                                ngayLap: new Date(hoKhau.ngayLap).toISOString().split("T")[0],
                              }
                            )
                            setIsUpdateDialogOpen(true)
                          }
                        }
                        >
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(hoKhau.maHoKhau)}
                          >Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không tìm thấy hộ khẩu nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}