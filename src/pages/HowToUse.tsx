import { Search, MousePointerClick, BookOpen, Heart } from "lucide-react";

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

const HowToUse = () => (
  <div className="container py-12 max-w-3xl">
    <h1 className="text-3xl font-bold text-foreground text-center mb-2 animate-fade-in">วิธีใช้งาน</h1>
    <p className="text-center text-muted-foreground mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      เริ่มต้นใช้งานง่ายๆ เพียง 4 ขั้นตอน
    </p>

    <div className="space-y-6">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex gap-5 items-start p-6 rounded-xl bg-card plant-card-shadow animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
        >
          <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <step.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              ขั้นตอนที่ {i + 1}: {step.title}
            </h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HowToUse;
