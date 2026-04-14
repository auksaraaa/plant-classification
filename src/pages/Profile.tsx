import { User, Mail, Edit, Heart, Clock } from "lucide-react";
import PlantCard from "@/components/PlantCard";
import { plants } from "@/data/plants";

const Profile = () => {
  const favPlants = plants.slice(0, 3);
  const recentPlants = plants.slice(3, 6);

  return (
    <div className="container py-12 max-w-4xl animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
          <User className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">ผู้ใช้ตัวอย่าง</h1>
          <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
            <Mail className="h-4 w-4" /> example@email.com
          </p>
          <button className="mt-3 inline-flex items-center gap-1 text-sm text-primary border border-primary px-4 py-1.5 rounded-lg hover:bg-accent transition-colors">
            <Edit className="h-4 w-4" /> แก้ไขโปรไฟล์
          </button>
        </div>
      </div>

      {/* Favorites */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-primary" /> พรรณไม้ที่ชื่นชอบ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favPlants.map((p) => <PlantCard key={p.id} plant={p} />)}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" /> เข้าชมล่าสุด
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentPlants.map((p) => <PlantCard key={p.id} plant={p} />)}
        </div>
      </div>
    </div>
  );
};

export default Profile;
