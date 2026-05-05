import { Leaf, Target, Users, Heart, Loader } from "lucide-react";

const About = () => {
  return (
  <div className="container max-w-full md:max-w-3xl px-3 sm:px-4 py-8 sm:py-12 animate-fade-in">
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">เกี่ยวกับเรา</h1>
      <p className="text-xs sm:text-base text-muted-foreground max-w-lg mx-auto px-2 sm:px-0">
        เว็บไซต์นี้พัฒนาโดยนิสิตวิทยาการคอมพิวเตอร์ เพื่อช่วยให้การค้นหาและจำแนกพันธุ์พืชทำได้ง่ายขึ้น ผ่านการค้นหาหรืออัปโหลดรูปภาพ พร้อมข้อมูลสำคัญในที่เดียว
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {[
        { icon: Target, title: "เป้าหมาย", desc: "สร้างแหล่งข้อมูลพรรณไม้ที่ครบถ้วน เข้าถึงง่าย และใช้งานสะดวกสำหรับทุกคน" },
        { icon: Leaf, title: "วิสัยทัศน์", desc: "ส่งเสริมให้ผู้คนเข้าใจและใกล้ชิดธรรมชาติมากขึ้น ผ่านการใช้เทคโนโลยีอย่างสร้างสรรค์" },
        { icon: Heart, title: "แรงบันดาลใจ", desc: "เกิดจากความสนใจในธรรมชาติ และความตั้งใจในการแบ่งปันความรู้ด้านพรรณไม้ให้กับทุกคน" },
        { icon: Users, title: "ทีมพัฒนา", desc: "พัฒนาโดยนิสิตด้านเทคโนโลยี ร่วมกับการศึกษาข้อมูลด้านพฤกษศาสตร์ เพื่อสร้างแพลตฟอร์มที่ใช้งานได้จริง" },
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
