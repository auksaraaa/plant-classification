import { useEffect } from "react";
import { Leaf, Target, Users, Heart, Loader } from "lucide-react";
import { useLineContext } from "@/contexts/LineContext";
import { validateLineConfig } from "@/config/line-config";

const About = () => {
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
  <div className="container max-w-full md:max-w-3xl px-3 sm:px-4 py-8 sm:py-12 animate-fade-in">
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">เกี่ยวกับเรา</h1>
      <p className="text-xs sm:text-base text-muted-foreground max-w-lg mx-auto px-2 sm:px-0">
        เราคือทีมผู้พัฒนาที่หลงใหลในธรรมชาติ และต้องการเผยแพร่ความรู้เรื่องพรรณไม้ให้ทุกคนเข้าถึงได้ง่าย
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {[
        { icon: Target, title: "เป้าหมาย", desc: "สร้างแหล่งข้อมูลพรรณไม้ที่ครบถ้วน เข้าถึงง่าย และใช้งานสะดวกสำหรับทุกคน" },
        { icon: Leaf, title: "วิสัยทัศน์", desc: "ส่งเสริมให้ผู้คนรักและเข้าใจธรรมชาติมากขึ้น ผ่านเทคโนโลยีที่ทันสมัย" },
        { icon: Heart, title: "แรงบันดาลใจ", desc: "ความรักในธรรมชาติและความต้องการแบ่งปันความรู้เรื่องพรรณไม้แก่สังคม" },
        { icon: Users, title: "ทีมพัฒนา", desc: "ทีมนักพัฒนาและผู้เชี่ยวชาญด้านพฤกษศาสตร์ ที่ร่วมกันสร้างสรรค์แพลตฟอร์มนี้" },
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

    <div className="text-center p-6 sm:p-8 rounded-lg sm:rounded-xl bg-secondary/60">
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">ติดต่อเรา</h2>
      <p className="text-xs sm:text-sm text-muted-foreground">
        หากมีคำถามหรือข้อเสนอแนะ สามารถติดต่อได้ที่ info@planthai.com
      </p>
    </div>
  </div>
  );
};

export default About;
