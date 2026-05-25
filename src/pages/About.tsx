import { Leaf, Target, Users, Heart, Loader } from "lucide-react";

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
  </div>
  );
};

export default About;
