import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Layout } from "./components/layout";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { DashboardPage } from "./pages/dashboard";
import { HoKhauPage } from "./pages/ho-khau";
import { HoKhauDetailPage } from "./pages/ho-khau/[id]";
import { NhanKhauPage } from "./pages/nhan-khau";
import { KhoanThuPage } from "./pages/khoan-thu";
import { ThuPhiPage } from "./pages/thu-phi";
import { TamTruTamVangPage } from "./pages/tam-tru-tam-vang";
import { ThongKePage } from "./pages/thong-ke";
import { CaiDatPage } from "./pages/cai-dat";
import { useAppStore } from "./store";
import { GET_USER_INFO_ROUTE } from "./utils/constant";
import { apiClient } from "./lib/api-client";
import { useEffect, useState } from "react";

const PrivateLayout = () => {
  const { userInfo } = useAppStore();
  if (!userInfo) return <Navigate to="/login" replace />;
  return <Layout />;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO_ROUTE, { withCredentials: true });
        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined as any);
        }
      } catch (error) {
        setUserInfo(undefined as any);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userInfo, setUserInfo]);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={userInfo ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={userInfo ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        <Route element={<PrivateLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/ho-khau" element={<HoKhauPage />} />
          <Route path="/ho-khau/:maHoKhau" element={<HoKhauDetailPage />} />
          <Route path="/nhan-khau" element={<NhanKhauPage />} />
          <Route path="/khoan-thu" element={<KhoanThuPage />} />
          <Route path="/thu-phi" element={<ThuPhiPage />} />
          <Route path="/tam-tru-tam-vang" element={<TamTruTamVangPage />} />
          <Route path="/thong-ke" element={<ThongKePage />} />
          <Route path="/cai-dat" element={<CaiDatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;