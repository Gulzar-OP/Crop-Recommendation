import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Recommend from "./pages/Recommend";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import { Login, Register } from "./pages/Auth";
import CropDetails from "./pages/CropDetails";

export default function App() {
  const protectedLayout = (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={protectedLayout}>
        <Route index element={<Dashboard />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="history" element={<History />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings" element={<Settings />} />
        <Route
        path="/crop/:cropName"
        element={<CropDetails />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
