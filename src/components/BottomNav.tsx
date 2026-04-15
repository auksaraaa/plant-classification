import { Link, useLocation } from "react-router-dom";
import { Home, Search, Info, User } from "lucide-react";

const bottomNavItems = [
  { path: "/", label: "หน้าแรก", icon: Home },
  { path: "/search", label: "ค้นหา", icon: Search },
  { path: "/about", label: "เกี่ยวกับเรา", icon: Info },
  { path: "/profile", label: "โปรไฟล์", icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm safe-area-inset-bottom z-40">
      <div className="container max-w-full px-0 flex h-16 items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={item.label}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
