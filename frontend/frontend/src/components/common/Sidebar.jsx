import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      name: 'Library',
      path: '/library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Search',
      path: '/search',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const username = isAuthenticated && user ? user.username : 'SYSTEM GUEST';
  const statusLabel = isAuthenticated ? 'ACTIVE' : 'OFFLINE';
  const statusColor = isAuthenticated ? 'bg-success' : 'bg-red-700';

  return (
    <aside className="w-64 bg-surface border-r-[3px] border-neo-border flex-col justify-between hidden md:flex h-screen sticky top-0">
      <div>
        {/* Gothic Logo branding */}
        <div className="py-xl px-lg border-b-[3px] border-neo-border flex items-center justify-center relative">
          <h1 className="text-[3.5rem] font-logo tracking-[0.08em] leading-none text-accent uppercase border-[3px] border-neo-border px-4 py-2 shadow-neo select-none">
            GAMEZ
          </h1>
          {/* Rivets */}
          <span className="absolute top-[4px] left-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>
          <span className="absolute top-[4px] right-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>
        </div>

        {/* Navigation Links */}
        <nav className="p-md flex flex-col gap-sm">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm border-[3px] font-title font-medium uppercase tracking-wider text-sm rounded-none transition-all duration-100 ease-in-out ${
                  isActive
                    ? 'bg-accent text-primary border-neo-border shadow-neo'
                    : 'bg-transparent text-muted-text border-transparent hover:border-neo-border hover:text-primary'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="py-xl px-lg border-t-[3px] border-neo-border relative bg-surface h-24 flex items-center select-none shrink-0">
        <span className="absolute bottom-[4px] left-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>
        <span className="absolute bottom-[4px] right-[4px] text-[8px] font-mono text-muted-text/30 pointer-events-none">[+]</span>

        <div className="flex items-center gap-sm w-full">
          <div className="w-8 h-8 bg-card border-[3px] border-neo-border rounded-none flex items-center justify-center font-bold text-primary font-mono text-sm shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-between w-full gap-sm">
              <span className="text-xs font-sans font-bold text-primary uppercase tracking-[0.03em] truncate max-w-24">
                {username}
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest flex items-center gap-xs shrink-0">
                <span className={`w-1.5 h-1.5 rounded-none inline-block ${statusColor}`} />
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
