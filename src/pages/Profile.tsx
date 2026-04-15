import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, LogOut, Image as ImageIcon, Loader } from "lucide-react";
import { useLineContext } from "@/contexts/LineContext";
import { useImageHistory } from "@/hooks/use-image-history";
import ImageUpload from "@/components/ImageUpload";
import ImageHistoryGallery from "@/components/ImageHistoryGallery";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading, isLoggedIn, profile, logout } = useLineContext();
  const {
    images,
    isLoading: historyLoading,
    uploadImageToHistory,
    deleteImageFromHistory,
  } = useImageHistory(profile?.userId);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      navigate("/");
    }
  }, [authLoading, isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("ออกจากระบบสำเร็จ");
    navigate("/");
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImageToHistory(file);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="container max-w-full md:max-w-4xl px-3 sm:px-4 py-8 sm:py-12 flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm sm:text-base text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Not logged in (this shouldn't show due to redirect, but for safety)
  if (!isLoggedIn || !profile) {
    return null;
  }

  return (
    <div className="container max-w-full md:max-w-4xl px-3 sm:px-4 py-8 sm:py-12 animate-fade-in">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover border-4 border-primary"
            />
          ) : (
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-accent flex items-center justify-center flex-shrink-0 border-4 border-primary">
              <User className="h-10 sm:h-12 w-10 sm:w-12 text-primary" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {profile.displayName}
          </h1>
          {profile.statusMessage && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {profile.statusMessage}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ID: {profile.userId}
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs sm:text-sm text-red-600 border border-red-600 px-3 sm:px-4 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-lg border bg-card">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 mb-4 sm:mb-6">
          <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          อัปโหลดรูปพืช
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          อัปโหลดรูปพืชที่คุณต้องการตรวจสอบ รูปภาพนี้จะถูกบันทึกในประวัติของคุณ
        </p>
        <ImageUpload
          onImageSelected={handleImageUpload}
          isLoading={historyLoading}
        />
      </div>

      {/* Image History Section */}
      <div className="p-4 sm:p-6 rounded-lg border bg-card">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 mb-4 sm:mb-6">
          <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          ประวัติรูปภาพ ({images.length})
        </h2>
        <ImageHistoryGallery
          images={images}
          onDelete={deleteImageFromHistory}
          isLoading={historyLoading}
        />
      </div>
    </div>
  );
};

export default Profile;
