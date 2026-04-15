import { useEffect } from "react";
import { Search, MousePointerClick, BookOpen, Heart, Loader } from "lucide-react";
import { useLineContext } from "@/contexts/LineContext";
import { validateLineConfig } from "@/config/line-config";

const steps = [
  {
    icon: Search,
    title: "ค้นหาพรรณไม้",
    desc: "พิมพ์ชื่อพรรณไม้ที่ต้องการค้นหาในช่องค้นหา หรือเลือกหมวดหมู่ที่สนใจ",
  },
  {
    icon: MousePointerClick,
    title: "เลือกดูรายละเอียด",
    desc: "คลิกที่การ์ดพรรณไม้เพื่อดูข้อมูลเชิงลึก ทั้งชื่อวิทยาศาสตร์ ลักษณะ และวิธีดูแล",
  },
  {
    icon: BookOpen,
    title: "เรียนรู้การดูแล",
    desc: "อ่านข้อมูลการดูแลรักษาพรรณไม้แต่ละชนิด เพื่อให้ต้นไม้ของคุณเติบโตสมบูรณ์",
  },
  {
    icon: Heart,
    title: "บันทึกรายการโปรด",
    desc: "เข้าสู่ระบบเพื่อบันทึกพรรณไม้ที่ชื่นชอบ และดูประวัติการเข้าชมย้อนหลัง",
  },
];

const HowToUse = () => {
  const { isLoggedIn, isLoading: authLoading, login } = useLineContext();

  // Force login
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      if (validateLineConfig()) {
        login();
      }
    }
  }, [isLoggedIn, authLoading, login]);

  // Show loading while authenticating
  if (authLoading || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">กำลังเข้าสู่ระบบ...</p>
      </div>
    );
  }

  return (
  <div className="container max-w-full md:max-w-3xl px-3 sm:px-4 py-8 sm:py-12">
    <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-2 sm:mb-3 animate-fade-in">วิธีใช้งาน</h1>
    <p className="text-center text-xs sm:text-base text-muted-foreground mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      เริ่มต้นใช้งานง่ายๆ เพียง 4 ขั้นตอน
    </p>

    <div className="space-y-4 sm:space-y-6">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex gap-3 sm:gap-5 items-start p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card plant-card-shadow animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
        >
          <div className="shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
              ขั้นตอนที่ {i + 1}: {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default HowToUse;
