import logoPath from "@assets/Spud Blocks Only Logo Color Full.png";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <img 
      src={logoPath} 
      alt="SpudChain Logo" 
      className={className}
      style={{ height: size }}
    />
  );
}
