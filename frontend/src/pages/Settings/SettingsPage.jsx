import Card from '../../components/ui/Card.jsx';
import { useTheme, useDefaultView, usePreferenceStore } from '../../store/preferenceStore.js';

export default function SettingsPage() {
  const theme = useTheme();
  const defaultView = useDefaultView();
  const updatePreference = usePreferenceStore((state) => state.updatePreference);

  const handleViewChange = (view) => {
    updatePreference({ defaultView: view });
  };

  return (
    <div className="flex flex-col gap-xl page-transition-wipe">
      {/* Intro */}
      <div className="border-b border-neo-border/10 pb-md">
        <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">CONTROL PANEL</h1>
        <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
          Calibrate your core GAMEZ application settings.
        </p>
      </div>

      <div className="w-full flex flex-col gap-lg">
        {/* Module 1: Interface Calibration */}
        <Card title="MODULE 01 // INTERFACE CALIBRATION" hasScrewHeads={true}>
          <div className="space-y-lg font-sans text-sm select-none">
            {/* Theme Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neo-border/10 pb-md gap-sm">
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase tracking-wider">SYSTEM THEME MODE</span>
                <span className="text-[10px] text-muted-text uppercase tracking-widest mt-0.5">Theme selector is locked to default.</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="w-2.5 h-2.5 bg-accent border border-black animate-pulse inline-block" />
                <span className="px-sm py-xs border-2 border-neo-border bg-accent text-[10px] font-mono font-bold text-primary uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {theme === 'DARK' ? 'DARK GOTHIC' : theme}
                </span>
              </div>
            </div>

            {/* Default Library View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neo-border/10 pb-md gap-sm">
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase tracking-wider">DEFAULT LAYOUT SLOT</span>
                <span className="text-[10px] text-muted-text uppercase tracking-widest mt-0.5">Set the active display state of the Armory.</span>
              </div>
              
              {/* Mechanical Toggle Button Rack */}
              <div className="flex border-[3px] border-neo-border p-0.5 bg-surface select-none h-10 items-center">
                {['CARD', 'SHELF', 'LIST'].map((view) => (
                  <button
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={`px-md h-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-100 ease-in-out cursor-pointer flex items-center justify-center ${
                      defaultView === view
                        ? 'bg-accent text-primary'
                        : 'text-muted-text hover:text-primary bg-transparent'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Steam Synchronization Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase tracking-wider">STEAM SYNCHRONIZATION</span>
                <span className="text-[10px] text-muted-text uppercase tracking-widest mt-0.5">Automatic import coordinates of catalog history.</span>
              </div>
              <span className="px-sm py-xs border-2 border-dashed border-neo-border/40 text-[10px] font-mono font-bold text-muted-text uppercase tracking-widest">
                LOCKED: POST-MVP V3.0
              </span>
            </div>
          </div>
        </Card>

        {/* Module 2: System Info */}
        <Card title="MODULE 02 // HARDWARE TELEMETRY" variant="surface" hasScrewHeads={true}>
          <div className="grid grid-cols-2 gap-sm text-[11px] font-mono">
            <span className="text-muted-text uppercase tracking-widest">GAMEZ Core Engine:</span>
            <span className="text-primary font-bold">v1.0.0</span>
            
            <span className="text-muted-text uppercase tracking-widest">Compiler Env:</span>
            <span className="text-primary font-bold uppercase">DEVELOPMENT // VITE</span>
            
            <span className="text-muted-text uppercase tracking-widest">Render Style:</span>
            <span className="text-accent font-bold uppercase">Gothic Neo-Brutalist Console</span>
            
            <span className="text-muted-text uppercase tracking-widest">Hardware Acceleration:</span>
            <span className="text-success font-bold uppercase">ENABLED</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
