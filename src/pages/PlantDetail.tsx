import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Leaf, Flower2, Cherry, Ruler, Droplets, Images } from "lucide-react";
import { usePlant } from "@/hooks/use-plants";
import { ScientificName } from "@/components/ui/ScientificName";

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
  const { plant, loading: plantLoading, error: plantError } = usePlant(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Show loading while fetching plant data
  if (plantLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">กำลังโหลดข้อมูลพรรณไม้...</p>
      </div>
    );
  }

  // Show error if plant fetch failed
  if (plantError) {
    return (
      <div className="container py-20 text-center">
        <p className="text-destructive">เกิดข้อผิดพลาด: {plantError}</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">กลับหน้าแรก</Link>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">ไม่พบข้อมูลพรรณไม้</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">กลับหน้าแรก</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-full px-3 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6">
        <ArrowLeft className="h-4 w-4" /> กลับหน้าแรก
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-xl sm:rounded-2xl overflow-hidden plant-card-shadow h-fit bg-accent">
          {plant.image ? (
            <img 
              src={plant.image} 
              alt={plant.name} 
              width={800} 
              height={800} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                console.error('Image failed to load:', plant.image);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        <div>
          <span className="text-xs sm:text-sm font-medium text-primary bg-accent px-2 sm:px-3 py-1 rounded-full inline-block">
            {plant.category || 'ไม่ระบุ'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 sm:mt-4">{plant.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2"><ScientificName name={plant.scientificName} /></p>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-foreground leading-relaxed">{plant.description}</p>

          {plant.characteristics && Object.keys(plant.characteristics).length > 0 && (
            <>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mt-6 sm:mt-8 mb-3 sm:mb-4">ลักษณะเฉพาะ</h2>
              <div className="space-y-2 sm:space-y-3">
                {(Object.keys(plant.characteristics) as Array<keyof typeof plant.characteristics>).map((key) => {
                  const Icon = icons[key];
                  const value = plant.characteristics[key];
                  if (!value) return null;
                  return (
                    <div key={key} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-secondary/60">
                      {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />}
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-foreground">{labels[key]}</span>
                        <p className="text-xs sm:text-sm text-muted-foreground">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Images Gallery */}
      {plant.additionalImages && plant.additionalImages.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
            <Images className="h-5 w-5 text-primary" />
            รูปภาพเพิ่มเติม
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {plant.additionalImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img.image)}
                className="group relative rounded-xl overflow-hidden plant-card-shadow bg-accent aspect-square cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <img
                  src={img.image}
                  alt={`${plant.name} - ${img.label}`}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3">
                  <span className="text-white text-xs sm:text-sm font-medium">{img.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="รูปภาพขยาย"
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default PlantDetail;
