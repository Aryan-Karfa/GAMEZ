export default function Card({
  children,
  title,
  className = '',
  variant = 'default',
  hasScrewHeads = true,
  ...props
}) {
  const baseStyle = 'relative border-[6px] border-neo-border rounded-none shadow-neo p-lg md:p-xl overflow-hidden';
  
  const bgStyles = {
    default: 'bg-card text-primary',
    surface: 'bg-surface text-primary',
    accent: 'bg-accent text-primary border-neo-border shadow-neo-accent',
  };

  const selectedBg = bgStyles[variant] || bgStyles.default;

  return (
    <div
      className={`${baseStyle} ${selectedBg} ${className}`}
      {...props}
    >
      {/* Visual Screw Heads in the corners of the chassis */}
      {hasScrewHeads && (
        <>
          <span className="absolute top-[4px] left-[4px] text-[8px] font-mono text-muted-text/35 select-none pointer-events-none">[+]</span>
          <span className="absolute top-[4px] right-[4px] text-[8px] font-mono text-muted-text/35 select-none pointer-events-none">[+]</span>
          <span className="absolute bottom-[4px] left-[4px] text-[8px] font-mono text-muted-text/35 select-none pointer-events-none">[+]</span>
          <span className="absolute bottom-[4px] right-[4px] text-[8px] font-mono text-muted-text/35 select-none pointer-events-none">[+]</span>
        </>
      )}

      {title && (
        <div className="border-b-[3px] border-neo-border pb-sm mb-md flex items-center justify-between">
          <h3 className="text-lg font-title tracking-wider uppercase text-primary">
            {title}
          </h3>
          {/* Subtle panel stripes in title bar */}
          <div className="h-2 w-16 warning-stripes opacity-20 border border-neo-border" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
