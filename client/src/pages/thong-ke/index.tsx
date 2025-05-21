"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

export function ThongKePage() {
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
          <TabsTrigger value="thu-phi">Thu phí</TabsTrigger>
          <TabsTrigger value="tam-tru-tam-vang">Tạm trú/Tạm vắng</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dan-cu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số hộ khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">Hộ gia đình</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số nhân khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">432</div>
                <p className="text-xs text-muted-foreground">Cư dân</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tạm trú</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Người</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tạm vắng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
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
                      <span className="font-medium">45 hộ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tòa B:</span>
                      <span className="font-medium">38 hộ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tòa C:</span>
                      <span className="font-medium">41 hộ</span>
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
                      <span>Dưới 18 tuổi:</span>
                      <span className="font-medium">98 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>18-30 tuổi:</span>
                      <span className="font-medium">124 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>31-50 tuổi:</span>
                      <span className="font-medium">156 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trên 50 tuổi:</span>
                      <span className="font-medium">54 người</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="thu-phi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng thu tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86.5M</div>
                <p className="text-xs text-muted-foreground">VND</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng thu quý này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245.8M</div>
                <p className="text-xs text-muted-foreground">VND</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ thu phí</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Đã thu: 96/124 hộ</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Khoản thu hiện tại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Đang thu</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Phân bố thu phí theo khoản thu</CardTitle>
                <CardDescription>Tổng thu theo từng khoản thu trong tháng</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Phí dịch vụ chung cư:</span>
                      <span className="font-medium">67.2M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Phí gửi xe máy:</span>
                      <span className="font-medium">9.6M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Phí gửi ô tô:</span>
                      <span className="font-medium">7.2M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quỹ bảo trì:</span>
                      <span className="font-medium">1.9M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quỹ từ thiện:</span>
                      <span className="font-medium">0.6M VND</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tình hình thu phí theo tháng</CardTitle>
                <CardDescription>Tổng thu theo tháng (6 tháng gần nhất)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Tháng 1/2023:</span>
                      <span className="font-medium">85.4M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tháng 2/2023:</span>
                      <span className="font-medium">82.1M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tháng 3/2023:</span>
                      <span className="font-medium">84.7M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tháng 4/2023:</span>
                      <span className="font-medium">83.9M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tháng 5/2023:</span>
                      <span className="font-medium">85.2M VND</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tháng 6/2023:</span>
                      <span className="font-medium">86.5M VND</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tam-tru-tam-vang" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số tạm trú</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Người</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số tạm vắng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Người</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Đăng ký mới tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Lượt đăng ký</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hết hạn trong tháng tới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Lượt đăng ký</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Lý do tạm trú</CardTitle>
                <CardDescription>Phân loại theo lý do tạm trú</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Thăm người thân:</span>
                      <span className="font-medium">6 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Công tác:</span>
                      <span className="font-medium">4 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Du lịch:</span>
                      <span className="font-medium">3 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Khác:</span>
                      <span className="font-medium">2 người</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Lý do tạm vắng</CardTitle>
                <CardDescription>Phân loại theo lý do tạm vắng</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Công tác:</span>
                      <span className="font-medium">3 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Du học:</span>
                      <span className="font-medium">2 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Thăm người thân:</span>
                      <span className="font-medium">2 người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Khác:</span>
                      <span className="font-medium">1 người</span>
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