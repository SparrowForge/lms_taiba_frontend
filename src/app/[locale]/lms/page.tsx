import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import LMSMainComponent from '@/components/lms/LMSMainComponent';



const LMSDashboard = () => {
    return (
        <ProtectedRoute>
            <MainLayout >
               <LMSMainComponent/>
               <h1>done</h1>

            </MainLayout>
        </ProtectedRoute>
    );
};

export default LMSDashboard;