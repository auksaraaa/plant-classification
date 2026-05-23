import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Leaf, Flower2, Cherry, Ruler, Layers, Sprout, Shield, AlertCircle, ImageOff, X } from "lucide-react";
import { usePlant } from "@/hooks/use-plants";
import { ScientificName } from "@/components/ui/ScientificName";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const icons = {
  leaf: Leaf,
  flower: Flower2,
  fruit: Cherry,
  height: Ruler,
  bark: Layers,
  ecology: Sprout,
  benefits: Shield,
  iucnStatus: AlertCircle,
};

const labels: Record<string, string> = {
  leaf: "ใบ",
  flower: "ดอกไม้",
  fruit: "ผล",
  height: "ความสูง",
  bark: "เปลือก",
  ecology: "นิเวศวิทยาและการกระจายพันธุ์",
  benefits: "ประโยชน์/โทษ",
  iucnStatus: "สถานะการอนุรักษ์ IUCN",
};

const partLabels: Record<'leaf' | 'flower' | 'fruit' | 'bark', string> = {
  leaf: "ใบ",
  flower: "ดอก",
  fruit: "ผล",
  bark: "เปลือก",
};

const iucnStatusMap: Record<string, string> = {
  "Extinct": "สูญพันธุ์ (Extinct - EX)",
  "Extinct in the Wild": "สูญพันธุ์ในถิ่นกำเนิด (Extinct in the Wild - EW)",
  "Critically Endangered": "วิกฤตอย่างยิ่ง (Critically Endangered - CR)",
  "Endangered": "วิกฤต (Endangered - EN)",
  "Vulnerable": "เสี่ยงวิกฤต (Vulnerable - VU)",
  "Near Threatened": "ใกล้เสี่ยงวิกฤต (Near Threatened - NT)",
  "Least Concern": "ไม่เสี่ยง (Least Concern - LC)",
  "Data Deficient": "ข้อมูลไม่พอ (Data Deficient - DD)",
  "Not Evaluated": "ยังไม่ได้ประเมิน (Not Evaluated - NE)",
};

const PlantDetail = () => {
  const { id } = useParams();
  const { plant, loading: plantLoading, error: plantError } = usePlant(id);
  const [selectedImage, setSelectedImage] = useState<{ url: string; label: string } | null>(null);

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
        <div className="flex flex-col gap-3 sm:gap-4 h-fit">
          <div 
            className="rounded-xl sm:rounded-2xl overflow-hidden plant-card-shadow bg-accent cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              if (plant.image) {
                setSelectedImage({ url: plant.image, label: plant.name });
              }
            }}
          >
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

          {plant.images && Object.values(plant.images).some(img => img) && (
            <>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">รูปถ่ายส่วนต่าง ๆ ของพรรณไม้</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {(Object.keys(partLabels) as Array<'leaf' | 'flower' | 'fruit' | 'bark'>).map((partType) => {
                  const imageUrl = plant.images?.[partType];
                  return (
                    <div
                      key={partType}
                      className="rounded-lg overflow-hidden bg-accent cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        if (imageUrl) {
                          setSelectedImage({ url: imageUrl, label: partLabels[partType] });
                        }
                      }}
                    >
                      <div className="aspect-square flex items-center justify-center bg-secondary/40">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={partLabels[partType]}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Failed to load ${partType} image:`, imageUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ImageOff className="h-6 w-6 sm:h-8 sm:w-8" />
                            <span className="text-xs sm:text-sm">{partLabels[partType]}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-foreground p-2 text-center">{partLabels[partType]}</p>
                    </div>
                  );
                })}
              </div>
            </>
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
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mt-6 sm:mt-8 mb-3 sm:mb-4">ลักษณะทั่วไป</h2>
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

          {(plant.ecology || plant.benefits || plant.iucnStatus) && (
            <>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mt-6 sm:mt-8 mb-3 sm:mb-4">ข้อมูลเพิ่มเติม</h2>
              <div className="space-y-2 sm:space-y-3">
                {plant.ecology && (
                  <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-secondary/60">
                    <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">นิเวศวิทยาและการกระจายพันธุ์</span>
                      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">{plant.ecology}</p>
                    </div>
                  </div>
                )}
                {plant.benefits && (
                  <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-secondary/60">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">ประโยชน์/โทษ</span>
                      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">{plant.benefits}</p>
                    </div>
                  </div>
                )}
                {plant.iucnStatus && (
                  <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-secondary/60">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">สถานะการอนุรักษ์ IUCN Red List 2022</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">{iucnStatusMap[plant.iucnStatus] || plant.iucnStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {plant.reference && (
            <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground italic">
              <span className="font-semibold">อ้างอิง:</span> {plant.reference}
            </p>
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-0 rounded-lg">
          <div className="relative flex items-center justify-center min-h-[50vh] sm:min-h-[70vh]">
            <Button
              onClick={() => setSelectedImage(null)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
            >
              <X className="h-6 w-6" />
            </Button>
            
            {selectedImage && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.label}
                  className="max-w-full max-h-[70vh] object-contain"
                />
                <p className="text-white text-center mt-4 text-sm sm:text-base">{selectedImage.label}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantDetail;
