import { User, Mail, Edit, Heart, Clock } from "lucide-react";
import PlantCard from "@/components/PlantCard";
import { plants } from "@/data/plants";

const Profile = () => {
  const favPlants = plants.slice(0, 3);
  const recentPlants = plants.slice(3, 6);

  return (
    <div className="container max-w-full md:max-w-4xl px-3 sm:px-4 py-8 sm:py-12 animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="h-10 sm:h-12 w-10 sm:w-12 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">ผู้ใช้ตัวอย่าง</h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> example@email.com
          </p>
          <button className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-xs sm:text-sm text-primary border border-primary px-3 sm:px-4 py-1.5 rounded-lg hover:bg-accent transition-colors">
            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> แก้ไขโปรไฟล์
          </button>
        </div>
      </div>

      {/* Favorites */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 mb-3 sm:mb-4">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> พรรณไม้ที่ชื่นชอบ
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {favPlants.map((p) => <PlantCard key={p.id} plant={p} />)}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 mb-3 sm:mb-4">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> เข้าชมล่าสุด
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {recentPlants.map((p) => <PlantCard key={p.id} plant={p} />)}
        </div>
      </div>
    </div>
  );
};

export default Profile;
