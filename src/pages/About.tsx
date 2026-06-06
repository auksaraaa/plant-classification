import { Leaf, Target, Users, Heart, Loader, Mail } from "lucide-react";

const About = () => {
  return (
  <div className="container max-w-full md:max-w-3xl px-3 sm:px-4 py-8 sm:py-12 animate-fade-in">
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">เกี่ยวกับเรา</h1>
        <p className="text-xs sm:text-base text-muted-foreground max-w-lg mx-auto px-2 sm:px-0">
          เว็บไซต์พรรณไม้จัดทำขึ้นเพื่อรวบรวมและเผยแพร่ข้อมูลพรรณไม้ภายในมหาวิทยาลัย เพื่อส่งเสริมการเรียนรู้และการอนุรักษ์ธรรมชาติ

        </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {[
        { icon: Target, title: "เป้าหมาย", desc: "สร้างแหล่งข้อมูลพรรณไม้ที่ครบถ้วน เข้าถึงง่าย และใช้งานสะดวกสำหรับทุกคน" },
        { icon: Leaf, title: "วิสัยทัศน์", desc: "เป็นแหล่งเรียนรู้ข้อมูลพรรณไม้ดิจิทัลที่เข้าถึงได้ง่ายและส่งเสริมการอนุรักษ์ธรรมชาติ" },
        { icon: Heart, title: "แรงบันดาลใจ", desc: "เกิดจากแนวคิดในการสร้างแหล่งเรียนรู้พรรณไม้ที่สะดวกต่อการค้นหาและส่งเสริมการอนุรักษ์ธรรมชาติ" },
        { icon: Users, title: "ทีมพัฒนา", desc: "พัฒนาโดยนิสิตวิทยาการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา" },
      ].map((item, i) => (
        <div
          key={i}
          className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card plant-card-shadow animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
        >
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* Contact Section */}
    <div className="border-t pt-8 sm:pt-12 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">ติดต่อเรา</h2>
      <p className="text-xs sm:text-base text-muted-foreground text-left max-w-2xl px-2 sm:px-0">
        Plantify ยินดีรับฟังหากมีข้อเสนอแนะ ข้อคิดเห็น หรือพบปัญหาในการใช้งาน สามารถติดต่อได้ที่
      </p>
      <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card plant-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Mail className="h-6 sm:h-7 w-6 sm:w-7 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-semibold text-foreground">ดร.วนิดา คำประไพ</p>
            <a href="mailto:wanida.kum@ku.th" className="text-sm sm:text-base font-medium text-primary hover:underline">
              wanida.kum@ku.th
            </a>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card plant-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Mail className="h-6 sm:h-7 w-6 sm:w-7 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-semibold text-foreground">ผศ.ดร.จิรวรรณ เจริญสุข</p>
            <a href="mailto:jirawan.charo@ku.th" className="text-sm sm:text-base font-medium text-primary hover:underline">
              jirawan.charo@ku.th
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default About;
