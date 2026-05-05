import { Sprout, Leaf } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: "h-5 w-5", text: "text-lg" },
  md: { icon: "h-6 w-6", text: "text-xl" },
  lg: { icon: "h-8 w-8", text: "text-2xl" },
};

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const { icon, text } = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <Sprout className={`${icon} text-white`} />
        <Leaf className={`${icon} text-white absolute -right-1 -top-1`} style={{ width: "60%", height: "60%" }} />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold text-white`}>พรรณไม้</span>
          <span className="text-xs text-white/70 -mt-1">ไทย</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
