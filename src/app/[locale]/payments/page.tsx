import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import PaymentsDashboard from "@/components/payments/PaymentsDashboard";

const PaymentDashboard: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
        <PaymentsDashboard/>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PaymentDashboard;
