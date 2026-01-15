import React from 'react'

import ResetPasswordPage from '@/components/auth/ResetPasswordPage'
import { PublicRoute } from '@/components/auth/PublicRoute'

const ResetPassword = () => {
    return (
        <PublicRoute>
            <ResetPasswordPage />
        </PublicRoute>
    )
}

export default ResetPassword
