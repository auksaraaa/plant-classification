import { Leaf, Target, Users, Heart } from "lucide-react";

const About = () => (
  <div className="container py-12 max-w-3xl animate-fade-in">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-foreground mb-3">เกี่ยวกับเรา</h1>
      <p className="text-muted-foreground max-w-lg mx-auto">
        เราคือทีมผู้พัฒนาที่หลงใหลในธรรมชาติ และต้องการเผยแพร่ความรู้เรื่องพรรณไม้ให้ทุกคนเข้าถึงได้ง่าย
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {[
        { icon: Target, title: "เป้าหมาย", desc: "สร้างแหล่งข้อมูลพรรณไม้ที่ครบถ้วน เข้าถึงง่าย และใช้งานสะดวกสำหรับทุกคน" },
        { icon: Leaf, title: "วิสัยทัศน์", desc: "ส่งเสริมให้ผู้คนรักและเข้าใจธรรมชาติมากขึ้น ผ่านเทคโนโลยีที่ทันสมัย" },
        { icon: Heart, title: "แรงบันดาลใจ", desc: "ความรักในธรรมชาติและความต้องการแบ่งปันความรู้เรื่องพรรณไม้แก่สังคม" },
        { icon: Users, title: "ทีมพัฒนา", desc: "ทีมนักพัฒนาและผู้เชี่ยวชาญด้านพฤกษศาสตร์ ที่ร่วมกันสร้างสรรค์แพลตฟอร์มนี้" },
      ].map((item, i) => (
        <div
          key={i}
          className="p-6 rounded-xl bg-card plant-card-shadow animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <item.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="text-center p-8 rounded-xl bg-secondary/60">
      <h2 className="text-lg font-semibold text-foreground mb-2">ติดต่อเรา</h2>
      <p className="text-sm text-muted-foreground">
        หากมีคำถามหรือข้อเสนอแนะ สามารถติดต่อได้ที่ info@planthai.com
      </p>
    </div>
  </div>
);

export default About;
