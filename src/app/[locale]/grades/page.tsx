import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  FaDownload,
  FaFilePdf,
  FaTrophy,
  FaUserCheck,
} from "react-icons/fa";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";
import { IoStatsChartSharp } from "react-icons/io5";
import GradeDashboard from "@/components/gradeDashboard/GradeDashboard";

const GradePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          <GradeDashboard />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default GradePage;
