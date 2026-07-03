import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export default function AuthLayout() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-md text-primary select-none selection:bg-accent selection:text-primary">
      <Outlet />
    </div>
  );
}
