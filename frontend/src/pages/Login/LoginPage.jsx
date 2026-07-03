import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password.trim()) {
      setValidationError('ALL INTERFACE FIELDS MUST BE FULLY COMPILED.');
      return;
    }

    const result = await login(email, password);
    if (result && result.success) {
      useUiStore.getState().addToast('SECURITY LINK ESTABLISHED.', 'success');
      navigate('/');
    }
  };

  const activeError = validationError || storeError;

  return (
    <div className="w-full max-w-140 flex flex-col gap-lg page-transition-wipe items-stretch">
      {/* Brand logo header */}
      <div className="text-center">
        <Link to="/" className="text-4xl tracking-[0.08em] text-accent uppercase font-logo border-4 border-neo-border px-6 py-3 shadow-neo hover:shadow-neo-accent transition-all inline-block bg-surface">
          GAMEZ
        </Link>
      </div>

      {/* Main card */}
      <Card title="SECURITY HANDSHAKE DECK" hasScrewHeads={true}>
        {/* Header / Subtitle inside the card for BIOS look */}
        <div className="text-center mb-md border-b border-neo-border/10 pb-sm">
          <h2 className="text-2xl font-title font-bold leading-none uppercase tracking-[0.06em] text-primary">LOGIN</h2>
          <p className="text-[10px] font-sans text-muted-text mt-xs uppercase tracking-widest">
            INITIALIZE CONNECTION TO PLATFORM INTERFACE
          </p>
        </div>

        {activeError && (
          <div className="border-[3px] border-accent bg-accent/10 p-sm text-[11px] font-mono text-accent uppercase tracking-wider mb-md animate-shake">
            ⚠️ INPUT ERROR DETECTED: {activeError}
          </div>
        )}

        <form className="space-y-md font-sans text-sm" onSubmit={handleSubmit}>
          <Input
            label="EMAIL ADDRESS"
            type="email"
            placeholder="operator@gamez.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            label="SECURITY KEY (PASSWORD)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full mt-sm font-title py-sm"
          >
            {loading ? 'BOOTING TERMINAL...' : 'ESTABLISH INTERFACE LINK'}
          </Button>
        </form>

        {/* Link to Register inside card for containment */}
        <div className="text-xs font-sans text-center pt-md border-t border-neo-border/10 mt-md uppercase tracking-wider">
          <span className="text-muted-text">UNREGISTERED IN INDEX? </span>
          <Link to="/register" className="text-accent font-black hover:underline tracking-widest">
            CREATE PLAYER PROFILE
          </Link>
        </div>
      </Card>
    </div>
  );
}
