const variants = {
  primary: `
    bg-gradient-to-r from-cyan-500 to-cyan-400
    text-slate-900 font-semibold
    shadow-lg shadow-cyan-500/25
    hover:shadow-cyan-500/40 hover:scale-[1.02]
    active:scale-[0.98]
  `,
  secondary: `
    bg-slate-800/80
    text-slate-200
    border border-slate-700/50
    hover:bg-slate-700/80 hover:border-slate-600/50
    active:scale-[0.98]
  `,
  danger: `
    bg-red-500/20
    text-red-400
    border border-red-500/30
    hover:bg-red-500/30
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent
    text-slate-400
    hover:text-slate-200 hover:bg-slate-800/50
    active:scale-[0.98]
  `
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium transition-all duration-200 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${variant === 'primary' ? 'btn-glow' : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
