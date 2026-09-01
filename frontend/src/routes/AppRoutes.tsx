import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Analytics from "@/pages/Analytics";
import Assistant from "@/pages/Assistant";
import Crops from "@/pages/Crops";
import Dashboard from "@/pages/Dashboard";
import DiseaseDetection from "@/pages/DiseaseDetection";
import Login from "@/pages/Login";
import LandingPage from "@/pages/LandingPage";
import Market from "@/pages/Market";
import Produce from "@/pages/Produce";
import Weather from "@/pages/Weather";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/layouts/AppLayout";
import CropDetails from "@/pages/CropDetails";
import Logistics from "@/pages/Logistics";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="weather" element={<Weather />} />
          <Route path="crops" element={<Crops />} />
          <Route path="crops/:cropId" element={<CropDetails />} />
          <Route path="disease-detection" element={<DiseaseDetection />} />
          <Route path="produce" element={<Produce />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="market" element={<Market />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="assistant" element={<Assistant />} />
        </Route>

        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;