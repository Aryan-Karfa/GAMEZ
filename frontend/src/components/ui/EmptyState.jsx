
export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default', // 'default' (dashed grey border), 'accent' (dashed accent border), 'error' (solid accent border with shake)
  className = '',
  ...props
}) {
  const variants = {
    default: 'border-dashed border-neo-border/20 bg-surface text-muted-text',
    accent: 'border-dashed border-neo-border/30 bg-card text-accent',
    error: 'border-accent bg-card animate-shake border-solid border-[6px]',
  };

  const titleColors = {
    default: 'text-muted-text',
    accent: 'text-accent',
    error: 'text-accent',
  };

  const borderStyle = variants[variant] || variants.default;
  const titleColor = titleColors[variant] || titleColors.default;

  // If error variant is used, we override the default border size of 6px to avoid duplicate borders
  const extraStyles = variant === 'error' ? '' : 'border-[6px]';

  return (
    <div
      className={`p-xl rounded-none select-none flex flex-col items-center justify-center text-center gap-md relative overflow-hidden ${extraStyles} ${borderStyle} ${className}`}
      {...props}
    >
      {icon && <div className="text-[4rem] leading-none">{icon}</div>}
      <div className="flex flex-col gap-xs">
        {title && (
          <h3 className={`text-xl md:text-2xl font-title uppercase tracking-widest ${titleColor}`}>
            {title}
          </h3>
        )}
        {description && (
          <p className="text-xs md:text-sm text-muted-text max-w-md leading-relaxed uppercase">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-sm">{action}</div>}
    </div>
  );
}
