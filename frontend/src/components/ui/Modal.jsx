import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  isOpen,
  onClose,
  title = 'DIAGNOSTIC OVERLAY',
  children,
  className = '',
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/90 z-9999 flex items-center justify-center p-md select-none">
      {/* Heavy Dialog Panel Container */}
      <div className={`w-[90vw] max-w-160 border-[6px] border-neo-border bg-card p-lg md:p-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none relative text-primary modal-transition-wipe overflow-hidden ${className}`}>
        
        {/* Screw head rivets in corners of dialogue cabinet */}
        <span className="absolute top-[4px] left-[4px] text-[8px] font-mono text-muted-text/35">[+]</span>
        <span className="absolute top-[4px] right-[4px] text-[8px] font-mono text-muted-text/35">[+]</span>
        <span className="absolute bottom-[4px] left-[4px] text-[8px] font-mono text-muted-text/35">[+]</span>
        <span className="absolute bottom-[4px] right-[4px] text-[8px] font-mono text-muted-text/35">[+]</span>

        {/* Close Button */}
        <div className="absolute top-md right-md">
          <button
            onClick={onClose}
            className="border-2 border-black bg-surface text-primary px-sm py-0.5 hover:bg-accent hover:text-white font-black transition-all duration-100 ease-in-out rounded-none cursor-pointer text-xs"
          >
            [X]
          </button>
        </div>

        {/* Dialog Header */}
        {title && (
          <div className="border-b-4 border-neo-border pb-sm mb-md flex items-center justify-between">
            <h3 className="text-xl font-title tracking-wider uppercase text-accent font-bold">
              🕹️ {title}
            </h3>
            {/* Design detail: stripes */}
            <div className="h-3 w-16 warning-stripes opacity-20 border border-black mr-12" />
          </div>
        )}

        {/* Modal content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>,
    document.body
  );
}
