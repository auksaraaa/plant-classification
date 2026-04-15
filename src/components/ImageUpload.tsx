import { useRef, useState } from "react";
import { Upload, Camera, Loader } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelected: (file: File) => Promise<boolean>;
  isLoading?: boolean;
}

const ImageUpload = ({ onImageSelected, isLoading = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const success = await onImageSelected(file);
      if (success && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const success = await onImageSelected(file);
      if (success && cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex gap-2 sm:gap-3">
        {/* Upload from device */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isUploading}
          className="flex-1 py-2.5 sm:py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm sm:text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              กำลังอัปโหลด...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              อัปโหลดรูป
            </>
          )}
        </button>

        {/* Capture from camera */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={isLoading || isUploading}
          className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 border-primary text-primary font-medium text-sm sm:text-base hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">ถ่ายรูป</span>
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
