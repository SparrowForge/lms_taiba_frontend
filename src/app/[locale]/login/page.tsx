import LeftComponent from '@/components/auth/LeftComponent';
import { PublicRoute } from '@/components/auth/PublicRoute';
import RightComponent from '@/components/auth/RightComponet';

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#1F4BCA]">
        <LeftComponent />
        <RightComponent />
      </div>
    </PublicRoute>
  );
}
