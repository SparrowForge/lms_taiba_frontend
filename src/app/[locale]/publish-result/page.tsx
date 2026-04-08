"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

import { LOCALE_KEYS } from '@/constants/localizationKeys'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import PublishResult from '@/components/publish-result/PublishResult'
import { PageHeader } from '@/components/ui/PageHeader'

import { useLocalization } from '@/hooks/useLocalization'

const PublishResultPage = () => {
    const { t } = useLocalization();
    const entityName = t(LOCALE_KEYS.RESULT, { defaultValue: 'Publish Result' });
    const router = useRouter()
    return (
        <ProtectedRoute>
            <MainLayout>
                <PageHeader
                    title={t(LOCALE_KEYS.RESULT, { name: entityName })}
                    onBack={() => router.back()}
                />
                <PublishResult />
            </MainLayout>
        </ProtectedRoute>
    )
}

export default PublishResultPage
