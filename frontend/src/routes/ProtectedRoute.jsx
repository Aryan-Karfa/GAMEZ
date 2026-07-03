import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  if (loading && token && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-xl font-mono text-accent animate-pulse h-screen bg-bg-main select-none">
        <div className="text-lg font-bold uppercase tracking-widest">VALIDATING ACCESS CARD...</div>
        <div className="text-xs text-muted-text mt-xs">CONNECTING SECURITY PORT [0x50C3]</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
