import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/layout"
import { LoginPage } from "./pages/login"
import { DashboardPage } from "./pages/dashboard"
import { HoKhauPage } from "./pages/ho-khau"
import { HoKhauDetailPage } from "./pages/ho-khau/[id]"
import { NhanKhauPage } from "./pages/nhan-khau"
import { KhoanThuPage } from "./pages/khoan-thu"
import { ThuPhiPage } from "./pages/thu-phi"
import { TamTruTamVangPage } from "./pages/tam-tru-tam-vang"
import { ThongKePage } from "./pages/thong-ke"
import { CaiDatPage } from "./pages/cai-dat"
import {useAppStore} from "./store";

function App() {
  const {userInfo} = useAppStore()
  const isAuthenticated = !!userInfo

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        {/* Protected routes wrapper */}
        <Route element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<DashboardPage />} />
          <Route path="/ho-khau" element={<HoKhauPage />} />
          <Route path="/ho-khau/:id" element={<HoKhauDetailPage />} />
          <Route path="/nhan-khau" element={<NhanKhauPage />} />
          <Route path="/khoan-thu" element={<KhoanThuPage />} />
          <Route path="/thu-phi" element={<ThuPhiPage />} />
          <Route path="/tam-tru-tam-vang" element={<TamTruTamVangPage />} />
          <Route path="/thong-ke" element={<ThongKePage />} />
          <Route path="/cai-dat" element={<CaiDatPage />} />

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
