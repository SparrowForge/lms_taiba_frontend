'use client';

import { useRouter } from 'next/navigation'
import React from 'react'

import { LOCALE_KEYS } from '@/constants/localizationKeys'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import CourseTimeline from '@/components/dashboard/course/CourseTimeline';
import { MainLayout } from '@/components/layout/MainLayout'
import { PageHeader } from '@/components/ui/PageHeader'

import { useLocalization } from '@/hooks/useLocalization';


const Timeline = () => {
    const { t } = useLocalization();
    const router = useRouter()
  return (
    <ProtectedRoute>
        <MainLayout>
            <PageHeader
              title={t(LOCALE_KEYS.TIMELINE)}
              onBack={() => router.back()}
            />
            <CourseTimeline/>
        </MainLayout>
    </ProtectedRoute>
  )
}

export default Timeline
