import {LoginForm} from '@/components/auth/LoginForm';
import {PublicRoute} from '@/components/auth/PublicRoute';

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="h-screen bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
        <LoginForm />
      </div>
    </PublicRoute>
  );
}
