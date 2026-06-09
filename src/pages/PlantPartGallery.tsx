import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";
import { usePlant } from "@/hooks/use-plants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const THUMBNAIL_LIMIT = 10;

const partLabels: Record<'leaf' | 'flower' | 'fruit' | 'bark', string> = {
  leaf: "ใบ",
  flower: "ดอก",
  fruit: "ผล",
  bark: "เปลือก",
};

const PlantPartGallery = () => {
  const { id, partType } = useParams();
  const navigate = useNavigate();
  const { plant, loading: plantLoading, error: plantError } = usePlant(id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);

  const validPartType = partType as 'leaf' | 'flower' | 'fruit' | 'bark' | undefined;
  const images = validPartType && plant?.images?.[validPartType]
    ? (Array.isArray(plant.images[validPartType]) ? plant.images[validPartType] as string[] : [])
    : [];

  const hasMoreThumbnails = images.length > THUMBNAIL_LIMIT;
  const visibleThumbnails = showAllThumbnails ? images : images.slice(0, THUMBNAIL_LIMIT);
  const hiddenCount = images.length - THUMBNAIL_LIMIT;

  if (plantLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">กำลังโหลดข้อมูลพรรณไม้...</p>
      </div>
    );
  }

  if (plantError || !plant || !validPartType || images.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-destructive">ไม่พบรูปภาพ</p>
        <Link to={`/plant/${id}`} className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> กลับไปยังรายละเอียด
        </Link>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (hasPrev) setCurrentIndex(currentIndex - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  return (
    <div className="container max-w-full px-3 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <Link to={`/plant/${id}`} className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6">
        <ArrowLeft className="h-4 w-4" /> กลับไปยังรายละเอียด
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{plant.name}</h1>
          <p className="text-muted-foreground mt-2">รูปถ่าย{partLabels[validPartType]}</p>
        </div>

        <div
          className="rounded-xl sm:rounded-2xl overflow-hidden plant-card-shadow bg-secondary/40 mb-4 sm:mb-6 cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => setIsFullscreen(true)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="relative aspect-square sm:aspect-video flex items-center justify-center">
            <img
              src={currentImage}
              alt={`${partLabels[validPartType]} ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Image failed to load:', currentImage);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 justify-between items-center mb-6 sm:mb-8">
          <Button
            onClick={handlePrev}
            disabled={!hasPrev}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="h-5 w-5 mr-2" /> ก่อนหน้า
          </Button>

          <div className="flex-1 text-center">
            <p className="text-sm text-muted-foreground">
              รูปที่ {currentIndex + 1} จากทั้งหมด {images.length} รูป
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!hasNext}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            ถัดไป <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {images.length > 1 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">รูปขนาดย่อ</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pb-2">
              {visibleThumbnails.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative rounded-lg overflow-hidden flex-shrink-0 aspect-square transition-all ${
                    idx === currentIndex ? 'ring-2 ring-primary' : 'hover:opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>

            {hasMoreThumbnails && !showAllThumbnails && (
              <button
                onClick={() => setShowAllThumbnails(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
                แสดงรูปภาพเพิ่มเติมอีก {hiddenCount} รูป
              </button>
            )}

            {showAllThumbnails && hasMoreThumbnails && (
              <button
                onClick={() => setShowAllThumbnails(false)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
                ย่อรูปขนาดย่อ
              </button>
            )}
          </div>
        )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-full w-full h-full p-0 border-0">
          <div className="w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center bg-black">
              <img
                src={currentImage}
                alt={`${partLabels[validPartType]} fullscreen`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="bg-black/90 p-4 flex gap-4 justify-between items-center">
              <Button
                onClick={handlePrev}
                disabled={!hasPrev}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> ก่อนหน้า
              </Button>

              <p className="text-white text-sm">
                {currentIndex + 1} / {images.length}
              </p>

              <Button
                onClick={handleNext}
                disabled={!hasNext}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white/20"
              >
                ถัดไป <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantPartGallery;