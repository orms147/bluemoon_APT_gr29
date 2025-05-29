"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { GET_ALL_HOKHAU_ROUTE, GET_ALL_NHANKHAU_ROUTE, GET_ALL_TTTV_ROUTE } from "@/utils/constant"
import { HoKhau, NhanKhau, TamTruTamVang } from '@/types'

function tinhTuoi(ngaySinh: string | Date): number {
  const sinh = new Date(ngaySinh)
  const homNay = new Date()

  let tuoi = homNay.getFullYear() - sinh.getFullYear()
  const chuaSinhNhat = (
    homNay.getMonth() < sinh.getMonth() ||
    (homNay.getMonth() === sinh.getMonth() && homNay.getDate() < sinh.getDate())
  )

  if (chuaSinhNhat) {
    tuoi--
  }

  return tuoi
}

export function ThongKePage() {
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [tttvList, setTttvList] = useState<TamTruTamVang[]>([])

  useEffect(() => {
    const fetchData = async() => {
      try {
        const [getListHoKhau, getListNhanKhau, getListTttv] = await Promise.all([
          apiClient.get(GET_ALL_HOKHAU_ROUTE, {withCredentials: true}),
          apiClient.get(GET_ALL_NHANKHAU_ROUTE, {withCredentials: true}),
          apiClient.get(GET_ALL_TTTV_ROUTE, {withCredentials: true})
        ])
        setHoKhauList(getListHoKhau.data)
        setNhanKhauList(getListNhanKhau.data)
        setTttvList(getListTttv.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  },[])

  const tamTruList = tttvList.filter((tttv) => tttv.loai === "Tạm trú")
  const tamVangList = tttvList.filter((tttv) => tttv.loai === "Tạm vắng")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê</h2>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <Tabs defaultValue="dan-cu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dan-cu">Dân cư</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dan-cu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số hộ khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hoKhauList.length}</div>
                <p className="text-xs text-muted-foreground">Hộ gia đình</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số nhân khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nhanKhauList.length}</div>
                <p className="text-xs text-muted-foreground">Cư dân</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tạm trú</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tamTruList.length}</div>
                <p className="text-xs text-muted-foreground">Người</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tạm vắng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tamVangList.length}</div>
                <p className="text-xs text-muted-foreground">Người</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Phân bố dân cư theo tòa nhà</CardTitle>
                <CardDescription>Số lượng hộ khẩu theo tòa nhà</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Tòa A:</span>
                      <span className="font-medium">{hoKhauList.filter((hk) => hk.diaChi.includes('Tòa A')).length} hộ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tòa B:</span>
                      <span className="font-medium">{hoKhauList.filter((hk) => hk.diaChi.includes('Tòa B')).length} hộ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tòa C:</span>
                      <span className="font-medium">{hoKhauList.filter((hk) => hk.diaChi.includes('Tòa C')).length} hộ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Phân bố theo độ tuổi</CardTitle>
                <CardDescription>Số lượng cư dân theo nhóm tuổi</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Dưới 18 tuổi: </span>
                      <span className="font-medium ml-1">{nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) < 18).length} người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>18-30 tuổi: </span>
                      <span className="font-medium ml-1">{nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 18 && tinhTuoi(nk.ngaySinh) <= 30).length} người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>31-50 tuổi: </span>
                      <span className="font-medium ml-1">{nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 31 && tinhTuoi(nk.ngaySinh) <= 50).length} người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trên 50 tuổi: </span>
                      <span className="font-medium ml-1">{nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) > 50).length} người</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}