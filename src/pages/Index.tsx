import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { categories } from "@/data/plants";
import { usePlants } from "@/hooks/use-plants";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-plants.jpg";
import { useLineContext } from "@/contexts/LineContext";
import { validateLineConfig } from "@/config/line-config";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading, login } = useLineContext();
  const { plants, loading: plantsLoading, error: plantsError } = usePlants();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");

  // Force login
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      if (validateLineConfig()) {
        login();
      }
    }
  }, [isLoggedIn, authLoading, login]);

  const filtered = useMemo(() => {
    return plants.filter((p) => {
      const matchSearch =
        p.name.includes(search) ||
        p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.includes(search);
      const matchCat = category === "ทั้งหมด" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, plants]);

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
    <div>
      {/* Hero */}
      <section className="relative h-[320px] sm:h-[360px] md:h-[420px] lg:h-[500px] overflow-hidden">
        <img src={heroImg} alt="พรรณไม้" width={1920} height={800} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 animate-fade-in leading-tight">
            ค้นหาพรรณไม้ที่คุณชื่นชอบ
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-sm sm:max-w-md md:max-w-lg mb-4 sm:mb-6 animate-fade-in line-clamp-2 sm:line-clamp-none" style={{ animationDelay: "0.1s" }}>
            สำรวจข้อมูลพรรณไม้หลากหลายชนิด พร้อมรายละเอียดการดูแลรักษา
          </p>
          {/* Search */}
          <div className="relative w-full max-w-2xl px-2 sm:px-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary/60 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="ค้นหาชื่อพรรณไม้..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={() => navigate(`/search?q=${encodeURIComponent(search)}`)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/search?q=${encodeURIComponent(search)}`);
                  }
                }}
                className="w-full h-12 sm:h-13 pl-10 sm:pl-12 pr-4 rounded-full border-2 border-white/30 bg-white/95 backdrop-blur-sm text-sm sm:text-base text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:bg-white/98 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container max-w-full px-3 sm:px-4 mt-6 sm:mt-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Plants grid */}
      <section className="container max-w-full px-3 sm:px-4 mt-6 sm:mt-8 pb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          {category === "ทั้งหมด" ? "พรรณไม้แนะนำ" : category} ({filtered.length})
        </h2>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filtered.map((plant, i) => (
              <div key={plant.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">ไม่พบพรรณไม้ที่ค้นหา</p>
        )}
      </section>
    </div>
  );
};

export default Index;
