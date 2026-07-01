export default function ProgressBar({
  value = 0,
  className = '',
  variant = 'accent', // 'accent', 'warning', 'success'
  ...props
}) {
  const boundedValue = Math.min(100, Math.max(0, value));
  const activeSegments = Math.round(boundedValue / 10);

  const colors = {
    accent: 'bg-accent border-accent',
    warning: 'bg-warning border-warning',
    success: 'bg-success border-success',
  };

  const activeColorClass = colors[variant] || colors.accent;

  return (
    <div className={`w-full flex items-center gap-sm ${className}`} {...props}>
      {/* Segmented LCD Container */}
      <div className="flex gap-0.75 p-0.75 border-[3px] border-neo-border bg-black w-full h-7 select-none">
        {Array.from({ length: 10 }).map((_, i) => {
          const isActive = i < activeSegments;
          return (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-150 ${
                isActive 
                  ? `${activeColorClass} border shadow-[inset_0_2px_0_rgba(255,255,255,0.4)]` 
                  : 'bg-surface border border-black/40'
              }`}
            />
          );
        })}
      </div>
      <span className="font-title text-sm text-primary tracking-wider min-w-9 text-right">
        {boundedValue}%
      </span>
    </div>
  );
}
