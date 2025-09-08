interface LogoProps {
  className?: string;
}

export const ConcieraLogo = ({ className = "w-10 h-10" }: LogoProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={className}
      fill="currentColor"
    >
      <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.1"/>
      <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 20 L24 24 L32 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M16 28 L24 32 L32 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="3" fill="currentColor"/>
    </svg>
  );
};