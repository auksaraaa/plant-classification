import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Leaf, Flower2, Cherry, Ruler, Droplets } from "lucide-react";
import { plants } from "@/data/plants";

const icons = {
  leaf: Leaf,
  flower: Flower2,
  fruit: Cherry,
  height: Ruler,
  care: Droplets,
};

const labels: Record<string, string> = {
  leaf: "ใบ",
  flower: "ดอก",
  fruit: "ผล",
  height: "ความสูง",
  care: "การดูแล",
};

const PlantDetail = () => {
  const { id } = useParams();
  const plant = plants.find((p) => p.id === id);

  if (!plant) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">ไม่พบข้อมูลพรรณไม้</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">กลับหน้าแรก</Link>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> กลับหน้าแรก
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden plant-card-shadow">
          <img src={plant.image} alt={plant.name} width={800} height={800} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="text-sm font-medium text-primary bg-accent px-3 py-1 rounded-full">
            {plant.category}
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-3">{plant.name}</h1>
          <p className="text-muted-foreground italic mt-1">{plant.scientificName}</p>
          <p className="mt-4 text-foreground leading-relaxed">{plant.description}</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">ลักษณะเฉพาะ</h2>
          <div className="space-y-3">
            {(Object.keys(plant.characteristics) as Array<keyof typeof plant.characteristics>).map((key) => {
              const Icon = icons[key];
              return (
                <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/60">
                  <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{labels[key]}</span>
                    <p className="text-sm text-muted-foreground">{plant.characteristics[key]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
