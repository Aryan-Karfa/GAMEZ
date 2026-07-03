import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-xs ${className}`}>
      {label && (
        <label className="font-bold text-primary text-xs uppercase tracking-wider">
          {label}
        </label>
      )}
      <div
        className={`flex items-center bg-surface border-[3px] transition-colors duration-150 px-md py-sm ${
          focused 
            ? 'border-accent text-accent' 
            : 'border-neo-border text-muted-text'
        } ${disabled ? 'opacity-50 cursor-not-allowed select-none' : ''}`}
      >
        {/* Terminal Bracket Prefix */}
        <span className={`font-mono font-black text-sm select-none pr-xs transition-colors ${focused ? 'text-accent' : 'text-muted-text'}`}>
          [
        </span>
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`flex-1 bg-transparent border-none text-primary placeholder-muted-text/50 text-sm rounded-none focus:outline-none w-full ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          {...props}
        />
        
        {/* Terminal Bracket Suffix */}
        <span className={`font-mono font-black text-sm select-none pl-xs transition-colors ${focused ? 'text-accent' : 'text-muted-text'}`}>
          ]
        </span>
      </div>
    </div>
  );
}
