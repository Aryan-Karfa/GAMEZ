export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  hasStripes = null, // auto-detect based on variant if not specified
  ...props
}) {
  const baseStyle = 'relative px-md py-sm font-title font-semibold uppercase tracking-wider text-sm rounded-none border-[3px] border-neo-border transition-all duration-100 ease-in-out select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 cursor-pointer';
  
  const variants = {
    primary: 'bg-accent text-primary shadow-neo hover:bg-accent-hover active:translate-x-1 active:translate-y-1 active:shadow-none',
    secondary: 'bg-surface text-primary shadow-neo hover:bg-card active:translate-x-1 active:translate-y-1 active:shadow-none',
    danger: 'bg-red-700 text-primary shadow-neo hover:bg-red-800 active:translate-x-1 active:translate-y-1 active:shadow-none',
  };

  const variantStyle = variants[variant] || variants.primary;
  const disabledStyle = 'opacity-50 cursor-not-allowed pointer-events-none active:translate-x-0 active:translate-y-0';

  // Should we show warning stripes on the left? Show for primary and danger variants.
  const showStripes = hasStripes !== null ? hasStripes : (variant === 'primary' || variant === 'danger');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${disabled ? disabledStyle : ''} ${showStripes ? 'pl-8' : ''} ${className}`}
      {...props}
    >
      {showStripes && (
        <span className="absolute left-0 top-0 bottom-0 w-5 warning-stripes border-r-[3px] border-neo-border block" />
      )}
      <span>{children}</span>
    </button>
  );
}
