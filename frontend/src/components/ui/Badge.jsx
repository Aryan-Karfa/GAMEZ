export default function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const baseStyle = 'inline-flex items-center gap-xs px-sm py-[3px] text-[10px] font-mono font-bold uppercase tracking-widest rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none';
  
  const variants = {
    default: 'bg-surface text-primary',
    accent: 'bg-accent text-primary',
    outline: 'bg-transparent text-primary border-neo-border',
  };

  const statusLightColors = {
    default: 'bg-muted-text',
    accent: 'bg-primary',
    outline: 'bg-accent',
  };

  const selectedVariant = variants[variant] || variants.default;
  const lightColor = statusLightColors[variant] || statusLightColors.default;

  return (
    <span
      className={`${baseStyle} ${selectedVariant} ${className}`}
      {...props}
    >
      <span className={`w-1.5 h-1.5 rounded-none ${lightColor}`} />
      <span>{children}</span>
    </span>
  );
}
