import { ImageHistoryItem } from "@/hooks/use-image-history";
import { Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface ImageHistoryGalleryProps {
  images: ImageHistoryItem[];
  onDelete?: (historyId: string, storagePath: string) => Promise<boolean>;
  isLoading?: boolean;
}

const ImageHistoryGallery = ({ 
  images, 
  onDelete,
  isLoading = false 
}: ImageHistoryGalleryProps) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-muted-foreground text-sm sm:text-base">
          ยังไม่มีประวัติรูปภาพ
        </p>
      </div>
    );
  }

  const handleDelete = async (historyId: string, storagePath: string) => {
    if (!onDelete) return;
    
    if (confirm('คุณต้องการลบรูปนี้หรือไม่?')) {
      await onDelete(historyId, storagePath);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.map((image) => (
          <div 
            key={image.id}
            className="group relative rounded-lg overflow-hidden bg-muted aspect-square"
          >
            {/* Image */}
            <img
              src={image.imageUrl}
              alt={image.plantName || 'Uploaded plant'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 sm:p-3">
              {/* Delete button */}
              {onDelete && (
                <button
                  onClick={() => handleDelete(image.id, image.storagePath)}
                  disabled={isLoading}
                  className="p-1.5 sm:p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  title="ลบรูป"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Info at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 text-white text-xs sm:text-sm">
              {image.plantName && (
                <p className="font-medium">{image.plantName}</p>
              )}
              <div className="flex items-center gap-1 text-gray-300 text-[10px] sm:text-xs mt-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(
                    new Date(image.uploadedAt),
                    { locale: th, addSuffix: true }
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List view for detailed info */}
      <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">รายละเอียดรูปภาพ</h3>
        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
          {images.slice(0, 5).map((image) => (
            <div
              key={image.id}
              className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {image.plantName || 'ผลการตรวจสอบ'}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(
                      new Date(image.uploadedAt),
                      { locale: th, addSuffix: true }
                    )}
                  </span>
                  {image.confidence !== undefined && (
                    <span className="hidden sm:inline">
                      • ความแน่นใจ: {(image.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              {image.confidence !== undefined && (
                <div className="ml-2 text-right">
                  <p className="text-xs sm:text-sm font-medium text-primary">
                    {(image.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
          ))}
          {images.length > 5 && (
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center py-2">
              และอีก {images.length - 5} รูป...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageHistoryGallery;
