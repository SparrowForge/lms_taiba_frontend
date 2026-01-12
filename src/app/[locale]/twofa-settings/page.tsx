"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import MailSettings from "@/components/twofa/MailSettings";
import AuthSettings from "@/components/twofa/AuthSettings";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALE_KEYS } from "@/constants/localizationKeys";

export default function TwofaPage() {
  const t = useTranslations()
  const router = useRouter()
  const entityName = t(LOCALE_KEYS.TWO_FA, { defaultValue: 'TwoFa' });

  return (

    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.TWO_FACTOR_AUTHENTICATION, { name: entityName })} onBack={() => router.back()} />
        <div className="flex justify-center items-center min-h-[80vh] gap-4">
          <MailSettings />
          <AuthSettings />
        </div>
      </MainLayout>
    </ProtectedRoute>

  );
}
