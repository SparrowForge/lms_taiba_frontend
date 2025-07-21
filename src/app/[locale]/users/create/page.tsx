'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {MainLayout} from "@/components/layout/MainLayout";
import {ProtectedRoute} from "@/components/auth/ProtectedRoute";
import {PageHeader} from "@/components/ui/PageHeader";
import UserForm from "@/components/users/UserForm";

export default function CreateUserPage() {
    const router = useRouter();

    return (
        <ProtectedRoute>
            <MainLayout>
                <div style={{ padding: '24px' }}>
                    <PageHeader
                        title="Create User"
                        onBack={() => router.back()}
                    />
                    <UserForm mode="create" />
                </div>
            </MainLayout>
        </ProtectedRoute>
    );
}
