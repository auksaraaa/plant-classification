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
    <div className="flex items-center gap-2 min-w-0">
      {/* Logo Icon */}
      <div className="relative flex items-center flex-shrink-0">
        <Sprout className={`${icon} text-white`} />
        <Leaf
          className={`${icon} text-white absolute -right-1 -top-1`}
          style={{ width: "60%", height: "60%" }}
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <span
            className={`${text} font-bold text-white leading-tight truncate`}
          >
            Plantify KU SRC
          </span>

          {/* Mobile */}
          <span className="block sm:hidden text-[9px] text-white/70 leading-tight">
            ฐานข้อมูลพรรณไม้เพื่อการเรียนรู้
            <br />
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
          </span>

          {/* Tablet & Desktop */}
          <span className="hidden sm:block text-xs md:text-sm text-white/70 leading-tight">
            ฐานข้อมูลพรรณไม้เพื่อการเรียนรู้ มหาวิทยาลัยเกษตรศาสตร์
            วิทยาเขตศรีราชา
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;