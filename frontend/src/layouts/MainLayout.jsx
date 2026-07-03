import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Header from '../components/common/Header.jsx';
import MobileNav from '../components/common/MobileNav.jsx';
import { useUiStore } from '../store/uiStore.js';

export default function MainLayout() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  return (
    <div className="flex min-h-screen bg-bg-main text-primary selection:bg-accent selection:text-primary relative">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 overflow-hidden">
        {/* Header bar */}
        <Header />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto px-6 md:px-xl py-6 md:py-xl flex flex-col gap-6 md:gap-xl w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Toast Notification Deck */}
      {toasts.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:right-6 z-50 flex flex-col gap-sm max-w-sm md:w-full pointer-events-none select-none">
          {toasts.map((toast) => {
            const variantColors = {
              success: 'border-success text-success bg-[#0b2b1a]',
              error: 'border-accent text-accent bg-[#2c0c0e] animate-shake',
              info: 'border-neo-border text-primary bg-card',
              warning: 'border-warning text-warning bg-[#2c1c0a]',
            };
            const borderClass = variantColors[toast.type] || variantColors.info;
            
            return (
              <div
                key={toast.id}
                className={`pointer-events-auto border-[3px] shadow-neo p-md flex items-center justify-between gap-md relative overflow-hidden bg-opacity-95 ${borderClass}`}
              >
                {/* Visual Screw Heads in the corners of the chassis */}
                <span className="absolute top-0.5 left-0.5 text-[6px] font-mono opacity-30 select-none">[+]</span>
                <span className="absolute top-0.5 right-0.5 text-[6px] font-mono opacity-30 select-none">[+]</span>
                <span className="absolute bottom-0.5 left-0.5 text-[6px] font-mono opacity-30 select-none">[+]</span>
                <span className="absolute bottom-0.5 right-0.5 text-[6px] font-mono opacity-30 select-none">[+]</span>

                <div className="font-mono text-xs uppercase tracking-wider font-bold">
                  {toast.type === 'error' ? '⚠️ ' : toast.type === 'success' ? '✓ ' : '📡 '}
                  {toast.message}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="font-mono font-black text-xs hover:text-primary cursor-pointer px-1 border border-transparent hover:border-neo-border/20 transition-all text-muted-text uppercase"
                >
                  [X]
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
