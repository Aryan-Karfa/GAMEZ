import React from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SYSTEM RUNTIME EXCEPTION:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void text-primary flex items-center justify-center p-md select-none crt-overlay">
          <div className="w-full max-w-lg space-y-md text-center">
            <div className="text-6xl animate-bounce mb-sm">⚠️</div>
            
            <div className="font-mono text-xs text-accent space-y-xs tracking-widest leading-relaxed border-t-2 border-b-2 border-accent/25 py-md">
              <div>━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="font-title text-xl text-primary tracking-widest font-normal">SYSTEM FAILURE</div>
              <div>GAMEZ ENCOUNTERED AN UNEXPECTED RUNTIME ERROR.</div>
              <div>DIAGNOSTICS HALTED.</div>
              <div>RESTART THE INTERFACE.</div>
              <div>━━━━━━━━━━━━━━━━━━━━━━</div>
            </div>

            {this.state.error && (
              <Card title="DIAGNOSTIC OUTPUT STREAM" variant="surface" className="text-left font-mono text-[9px] text-muted-text max-h-40 overflow-y-auto">
                <span className="text-accent font-bold">ERROR:</span> {this.state.error.toString()}
              </Card>
            )}

            <div className="pt-md">
              <Button
                onClick={this.handleReload}
                variant="primary"
                className="px-lg py-sm font-title text-md tracking-widest"
              >
                [ REBOOT TERMINAL ]
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
