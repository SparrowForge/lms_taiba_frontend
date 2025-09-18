import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CoursesStudenLayout from '@/components/coursesStudent/CoursesStudenLayout';
import { MainLayout } from '@/components/layout/MainLayout';



const CoursesStudent = () => {
    return (
        <ProtectedRoute>
            <MainLayout>
                <div className="h-[95vh] overflow-y-auto">
                    <CoursesStudenLayout />
                </div>
            </MainLayout>
        </ProtectedRoute>
    );
};

export default CoursesStudent;