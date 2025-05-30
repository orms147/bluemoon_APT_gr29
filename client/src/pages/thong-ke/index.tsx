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

  const handleExportPDF = () => {
    const printWindow = window.open("", "PrintWindow", "width=1000,height=1000")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Báo cáo thống kê dân cư</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                line-height: 1.6;
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                border-bottom: 2px solid #0066cc;
                padding-bottom: 20px;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #0066cc;
                text-transform: uppercase;
              }
              .subtitle {
                font-size: 16px;
                margin-bottom: 5px;
              }
              .date {
                font-style: italic;
                margin-bottom: 30px;
                color: #666;
              }
              .section {
                margin-bottom: 40px;
                page-break-inside: avoid;
              }
              .section-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #0066cc;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 30px;
              }
              .stat-item {
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f8f9fa;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              }
              .stat-value {
                font-size: 28px;
                font-weight: bold;
                color: #0066cc;
                margin-bottom: 8px;
              }
              .stat-label {
                color: #666;
                font-size: 14px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background-color: white;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #f5f5f5;
                font-weight: bold;
                color: #0066cc;
              }
              tr:nth-child(even) {
                background-color: #f8f9fa;
              }
              .signature-section {
                margin-top: 50px;
                text-align: right;
                page-break-inside: avoid;
              }
              .signature-title {
                font-weight: bold;
                margin-bottom: 10px;
              }
              .signature-date {
                font-style: italic;
                color: #666;
                margin-bottom: 50px;
              }
              .signature-line {
                margin-top: 50px;
                border-top: 1px dotted #999;
                width: 200px;
                margin-left: auto;
              }
              @media print {
                body {
                  padding: 20px;
                }
                .section {
                  page-break-inside: avoid;
                }
                table {
                  page-break-inside: auto;
                }
                tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">BÁO CÁO THỐNG KÊ DÂN CƯ</div>
              <div class="subtitle">Khu chung cư BlueMoon</div>
              <div class="date">Ngày ${new Date().toLocaleDateString("vi-VN")}</div>
            </div>

            <div class="section">
              <div class="section-title">1. Thông tin tổng quan</div>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">${hoKhauList.length}</div>
                  <div class="stat-label">Tổng số hộ khẩu đăng ký thường trú</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${nhanKhauList.length}</div>
                  <div class="stat-label">Tổng số nhân khẩu thường trú</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${tamTruList.length}</div>
                  <div class="stat-label">Số người đăng ký tạm trú</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${tamVangList.length}</div>
                  <div class="stat-label">Số người đăng ký tạm vắng</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">2. Phân bố dân cư theo tòa nhà</div>
              <table>
                <tr>
                  <th>Tòa nhà</th>
                  <th>Số hộ khẩu</th>
                  <th>Tỷ lệ</th>
                  <th>Số nhân khẩu</th>
                </tr>
                <tr>
                  <td>Tòa A</td>
                  <td>${hoKhauList.filter((hk) => hk.diaChi.includes('Tòa A')).length}</td>
                  <td>${((hoKhauList.filter((hk) => hk.diaChi.includes('Tòa A')).length / hoKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => {
                    const hoKhau = hoKhauList.find(hk => hk.maHoKhau === nk.hoKhauId);
                    return hoKhau && hoKhau.diaChi.includes('Tòa A');
                  }).length}</td>
                </tr>
                <tr>
                  <td>Tòa B</td>
                  <td>${hoKhauList.filter((hk) => hk.diaChi.includes('Tòa B')).length}</td>
                  <td>${((hoKhauList.filter((hk) => hk.diaChi.includes('Tòa B')).length / hoKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => {
                    const hoKhau = hoKhauList.find(hk => hk.maHoKhau === nk.hoKhauId);
                    return hoKhau && hoKhau.diaChi.includes('Tòa B');
                  }).length}</td>
                </tr>
                <tr>
                  <td>Tòa C</td>
                  <td>${hoKhauList.filter((hk) => hk.diaChi.includes('Tòa C')).length}</td>
                  <td>${((hoKhauList.filter((hk) => hk.diaChi.includes('Tòa C')).length / hoKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => {
                    const hoKhau = hoKhauList.find(hk => hk.maHoKhau === nk.hoKhauId);
                    return hoKhau && hoKhau.diaChi.includes('Tòa C');
                  }).length}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">3. Phân bố theo độ tuổi</div>
              <table>
                <tr>
                  <th>Nhóm tuổi</th>
                  <th>Số lượng</th>
                  <th>Tỷ lệ</th>
                  <th>Nam</th>
                  <th>Nữ</th>
                </tr>
                <tr>
                  <td>Dưới 18 tuổi</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) < 18).length}</td>
                  <td>${((nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) < 18).length / nhanKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) < 18 && nk.gioiTinh === "Nam").length}</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) < 18 && nk.gioiTinh === "Nữ").length}</td>
                </tr>
                <tr>
                  <td>18-30 tuổi</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 18 && tinhTuoi(nk.ngaySinh) <= 30).length}</td>
                  <td>${((nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 18 && tinhTuoi(nk.ngaySinh) <= 30).length / nhanKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 18 && tinhTuoi(nk.ngaySinh) <= 30 && nk.gioiTinh === "Nam").length}</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 18 && tinhTuoi(nk.ngaySinh) <= 30 && nk.gioiTinh === "Nữ").length}</td>
                </tr>
                <tr>
                  <td>31-50 tuổi</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 31 && tinhTuoi(nk.ngaySinh) <= 50).length}</td>
                  <td>${((nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 31 && tinhTuoi(nk.ngaySinh) <= 50).length / nhanKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 31 && tinhTuoi(nk.ngaySinh) <= 50 && nk.gioiTinh === "Nam").length}</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) >= 31 && tinhTuoi(nk.ngaySinh) <= 50 && nk.gioiTinh === "Nữ").length}</td>
                </tr>
                <tr>
                  <td>Trên 50 tuổi</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) > 50).length}</td>
                  <td>${((nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) > 50).length / nhanKhauList.length) * 100).toFixed(1)}%</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) > 50 && nk.gioiTinh === "Nam").length}</td>
                  <td>${nhanKhauList.filter((nk) => tinhTuoi(nk.ngaySinh) > 50 && nk.gioiTinh === "Nữ").length}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">4. Thống kê tạm trú, tạm vắng</div>
              <table>
                <tr>
                  <th>Loại đăng ký</th>
                  <th>Số lượng</th>
                  <th>Đang hiệu lực</th>
                  <th>Hết hiệu lực</th>
                </tr>
                <tr>
                  <td>Tạm trú</td>
                  <td>${tamTruList.length}</td>
                  <td>${tamTruList.filter(tt => new Date(tt.denNgay) >= new Date()).length}</td>
                  <td>${tamTruList.filter(tt => new Date(tt.denNgay) < new Date()).length}</td>
                </tr>
                <tr>
                  <td>Tạm vắng</td>
                  <td>${tamVangList.length}</td>
                  <td>${tamVangList.filter(tv => new Date(tv.denNgay) >= new Date()).length}</td>
                  <td>${tamVangList.filter(tv => new Date(tv.denNgay) < new Date()).length}</td>
                </tr>
              </table>
            </div>

            <div class="signature-section">
              <div class="signature-date">Hà Nội, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</div>
              <div class="signature-title">Người lập báo cáo</div>  
              <div class="signature-line"></div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê</h2>
        <Button variant="outline" onClick={handleExportPDF}>
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