"use client"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/ui/PageHeader"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SettingsPage = () => {
    const t = useTranslations();
    const entityName = t('settings', { defaultValue: 'Settings' });
    const router = useRouter()
    return (
        <ProtectedRoute>
            <MainLayout>
                <PageHeader title={t('Settings', { name: entityName })} onBack={() => router.back()} />
               <div className="m-8">
                 <Link href="twofa-settings">
                    Twofa
                </Link>
               </div>
            </MainLayout>
        </ProtectedRoute>
    )
}

export default SettingsPage
