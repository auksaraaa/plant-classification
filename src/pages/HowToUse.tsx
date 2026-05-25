import { Search, FolderTree, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "ค้นหาพรรณไม้",
    desc: "พิมพ์ชื่อพรรณไม้เพื่อค้นหาข้อมูลได้ทันที"
  },
  {
    icon: FolderTree,
    step: "เลือกหมวดหมู่พรรณไม้",
    desc: "เลือกประเภทพรรณไม้ที่สนใจ เช่น ไม้ยืนต้น ไม้ดอก หรือสมุนไพร เพื่อดูข้อมูลเฉพาะหมวดหมู่"
  },
  {
    icon: BookOpen,
    step: "ดูรายละเอียดพรรณไม้",
    desc: "กดเลือกพรรณไม้ที่ต้องการ เพื่อดูรายละเอียด เช่น ลักษณะทั่วไป ประโยชน์ และรูปภาพประกอบ"
  }
];

const HowToUse = () => {
  return (
  <div className="container max-w-full md:max-w-3xl px-3 sm:px-4 py-8 sm:py-12">
    <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-2 sm:mb-3 animate-fade-in">วิธีใช้งาน</h1>
    <p className="text-center text-xs sm:text-base text-muted-foreground mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      เริ่มต้นใช้งานง่ายๆ เพียง 3 ขั้นตอน
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
              ขั้นตอนที่ {i + 1}: {step.step}
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
