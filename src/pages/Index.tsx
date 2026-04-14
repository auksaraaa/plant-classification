import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { plants, categories } from "@/data/plants";
import PlantCard from "@/components/PlantCard";
import heroImg from "@/assets/hero-plants.jpg";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");

  const filtered = useMemo(() => {
    return plants.filter((p) => {
      const matchSearch =
        p.name.includes(search) ||
        p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.includes(search);
      const matchCat = category === "ทั้งหมด" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[360px] md:h-[420px] overflow-hidden">
        <img src={heroImg} alt="พรรณไม้" width={1920} height={800} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 animate-fade-in">
            ค้นหาพรรณไม้ที่คุณชื่นชอบ
          </h1>
          <p className="text-muted-foreground max-w-lg mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            สำรวจข้อมูลพรรณไม้หลากหลายชนิด พร้อมรายละเอียดการดูแลรักษา
          </p>
          {/* Search */}
          <div className="relative w-full max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหาชื่อพรรณไม้..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border bg-background/90 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mt-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
      <section className="container mt-8 pb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {category === "ทั้งหมด" ? "พรรณไม้แนะนำ" : category} ({filtered.length})
        </h2>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
