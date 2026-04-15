import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { plants, categories } from "@/data/plants";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get("q") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("ทั้งหมด");

  const filtered = useMemo(() => {
    return plants.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "ทั้งหมด" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-6 sm:py-8">
        <div className="container max-w-full px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">ค้นหาพรรณไม้</h1>
          <div className="relative w-full max-w-lg">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none z-10" />
            <input
              type="text"
              placeholder="ค้นหาชื่อพรรณไม้..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={handleSearch}
              onKeyPress={handleKeyPress}
              className="w-full h-11 sm:h-12 pl-9 sm:pl-12 pr-4 rounded-full border bg-background text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container max-w-full px-3 sm:px-4 mt-6 sm:mt-8">
        <div className="flex flex-wrap gap-2">
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
          {category === "ทั้งหมด" ? "ผลลัพธ์การค้นหา" : category} ({filtered.length})
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
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">ไม่พบพรรณไม้ที่ค้นหา</p>
            <Button 
              onClick={() => {
                setSearch("");
                setCategory("ทั้งหมด");
                navigate("/search");
              }}
              variant="outline"
            >
              รีเซ็ตการค้นหา
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;
