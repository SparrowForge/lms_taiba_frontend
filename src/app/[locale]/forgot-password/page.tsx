import React from 'react'

import ForgotPasswordPage from '@/components/auth/ForgotPassword'
import { PublicRoute } from '@/components/auth/PublicRoute'

const ForgotPassword = () => {
    return (
        <PublicRoute>
            <ForgotPasswordPage />
        </PublicRoute>
    )
}

export default ForgotPassword
