import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';

export default function NotFoundPage() {
  return (
    <div className="w-full max-w-md mx-auto py-xl flex flex-col gap-lg items-center text-center page-transition-wipe">
      <div className="text-[6rem] leading-none animate-pulse">🛰️</div>
      
      <h2 className="text-[2.5rem] font-title font-normal leading-none uppercase tracking-[0.06em] text-accent">
        404 // ROUTE OUT OF RANGE
      </h2>
      
      <p className="text-xs font-sans text-muted-text uppercase tracking-widest leading-relaxed">
        The coordinates you entered do not correspond with any index node in the active database mainframe.
      </p>

      <Card title="DIAGNOSTIC TELEMETRY" variant="surface" className="w-full text-left font-mono text-[10px] text-muted-text flex flex-col gap-1">
        <div>SECTOR: OUTER_BOUNDS</div>
        <div>NODE_STATE: UNRESOLVED [0x404]</div>
        <div>OPERATION: CRITICAL_ABORT</div>
      </Card>

      <div className="pt-md w-full flex justify-center">
        <Link
          to="/"
          className="inline-block px-lg py-sm border-[3px] border-neo-border bg-accent text-primary font-title text-md tracking-widest uppercase shadow-neo hover:shadow-neo-accent transition-all duration-100 ease-in-out rounded-none active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          🎮 RETURN TO COMMAND DECK
        </Link>
      </div>
    </div>
  );
}
