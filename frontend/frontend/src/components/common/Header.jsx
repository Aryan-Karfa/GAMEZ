import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const getPageTitle = (path) => {
    if (path === '/') return 'DASHBOARD CONSOLE';
    if (path.startsWith('/library')) return 'ARMORY LIBRARY';
    if (path.startsWith('/search')) return 'SCANNING TERMINAL';
    if (path.startsWith('/games')) return 'CARTRIDGE DATA';
    if (path.startsWith('/profile')) return 'PLAYER PROFILE';
    if (path.startsWith('/settings')) return 'COMMAND CONSOLE';
    return 'GAMEZ';
  };

  const title = getPageTitle(location.pathname);

  const handleSessionAction = async () => {
    if (isAuthenticated) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <header className="h-20 border-b-[3px] border-neo-border bg-surface flex items-center justify-between px-6 md:px-xl select-none relative">
      {/* Rivet details */}
      <span className="absolute top-[4px] left-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>
      <span className="absolute bottom-[4px] left-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>
      <span className="absolute top-[4px] right-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>
      <span className="absolute bottom-[4px] right-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>

      {/* Dynamic Title */}
      <h2 className="text-2xl md:text-3xl font-title tracking-wider font-bold leading-none text-primary uppercase">
        {title}
      </h2>

      {/* Dynamic Session Area */}
      <div className="flex items-center gap-md">
        {isAuthenticated ? (
          <div className="flex items-center gap-sm">
            <span className="text-[10px] font-mono text-muted-text uppercase tracking-widest hidden sm:inline">
              OPERATOR: {user?.username?.toUpperCase()}
            </span>
            <button
              onClick={handleSessionAction}
              className="border-2 border-neo-border bg-card hover:bg-accent hover:text-primary text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-sm py-1.5 transition-colors rounded-none shadow-[2px_2px_0px_0px_#EBEBEB] cursor-pointer"
            >
              DISCONNECT
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="border-2 border-neo-border bg-accent text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-sm py-1.5 hover:bg-accent-hover transition-colors rounded-none shadow-[2px_2px_0px_0px_#EBEBEB]"
          >
            ESTABLISH LINK
          </Link>
        )}
      </div>
    </header>
  );
}
