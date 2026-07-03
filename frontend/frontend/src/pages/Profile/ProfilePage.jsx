import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useAuthStore } from '../../store/authStore.js';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const username = isAuthenticated && user ? user.username : 'SYSTEM OPERATOR';
  const email = isAuthenticated && user ? user.email : 'operator@gamez.local';
  const joinedDate = isAuthenticated && user && user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026-06-30';

  return (
    <div className="flex flex-col gap-xl page-transition-wipe">
      {/* Intro */}
      <div className="border-b border-neo-border/10 pb-md">
        <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">PLAYER DOSSIER</h1>
        <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
          Inspect personal authentication telemetry coordinates.
        </p>
      </div>

      {/* Profile Card / Pilot License Frame */}
      <div className="w-full max-w-144">
        <Card title="PLAYER ACCESS CODE LICENSE" hasScrewHeads={true} className="relative overflow-hidden">
          {/* Lamination shine detail */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />
          
          <div className="space-y-md">
            {/* Avatar & Basic */}
            <div className="flex items-center gap-md select-none border-b-2 border-neo-border pb-md">
              <div className="w-16 h-16 bg-accent border-[3px] border-neo-border flex items-center justify-center font-bold text-2xl text-primary font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-title tracking-wider text-primary uppercase">{username}</span>
                <span className="text-[10px] font-mono text-muted-text uppercase tracking-widest">RANK: ADMINISTRATOR // CODENAME: {username.toUpperCase()}</span>
              </div>
            </div>

            {/* Details Table */}
            <div className="grid grid-cols-2 gap-sm text-[11px] font-mono pt-sm">
              <span className="text-muted-text uppercase tracking-widest">EMAIL ADDRESS:</span>
              <span className="text-primary font-bold">{email}</span>
              
              <span className="text-muted-text uppercase tracking-widest">COMMISSION DATE:</span>
              <span className="text-primary font-bold">{joinedDate}</span>

              <span className="text-muted-text uppercase tracking-widest">ACCESS LEVEL:</span>
              <span>
                <Badge variant={isAuthenticated ? 'accent' : 'outline'}>
                  {isAuthenticated ? 'VERIFIED LINK' : 'OFFLINE MODE'}
                </Badge>
              </span>
            </div>

            {/* Warning striping at the footer */}
            <div className="border-t-[3px] border-neo-border/20 pt-md">
              <div className="h-4 warning-stripes border border-neo-border/40 flex items-center justify-center text-[8px] font-mono text-primary font-black uppercase tracking-widest select-none">
                SECURITY COMPLIANCE SECURED
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
