"use client"

import { PublicRoute } from '@/components/auth/PublicRoute';
import VerifyTwofaPage from '@/components/auth/VerifyTwofaPage';

export default function Verify2FAPage() {
  return (
    <PublicRoute>
      <VerifyTwofaPage />
    </PublicRoute>
  );
}

