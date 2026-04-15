import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, LogOut, Image as ImageIcon, Loader, Leaf, Clock } from "lucide-react";
import { useLineContext } from "@/contexts/LineContext";
import { useImageHistory } from "@/hooks/use-image-history";
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
      {/* Profile Header with Background */}
      <div className="mb-8 sm:mb-10">
        <div className="relative rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 lg:p-10">
          {/* Decorative Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -ml-12 -mb-12" />
          
          <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Avatar with Enhanced Styling */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/60 opacity-0 hover:opacity-100 transition-opacity duration-300 blur" />
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.displayName}
                  className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-full object-cover border-4 border-primary shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              ) : (
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center border-4 border-primary shadow-lg">
                  <User className="h-12 sm:h-14 w-12 sm:w-14 text-white" />
                </div>
              )}
              {/* Online Status Badge */}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-slate-950 shadow-md" />
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {profile.displayName}
                </h1>
              </div>
              {profile.statusMessage && (
                <p className="text-sm sm:text-base text-muted-foreground mb-4 italic">
                  "{profile.statusMessage}"
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">{profile.userId}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-600 border border-red-600 px-4 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
        <div className="rounded-xl border bg-card hover:shadow-md transition-shadow duration-300 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 sm:p-4 rounded-lg bg-primary/10">
              <ImageIcon className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide font-medium">ประวัติรูปภาพ</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {images.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card hover:shadow-md transition-shadow duration-300 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 sm:p-4 rounded-lg bg-primary/10">
              <Leaf className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide font-medium">พืชที่ค้นหา</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {images.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image History Section */}
      <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            ประวัติการค้นหาพืช
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            รูปภาพที่คุณได้ค้นหาและตรวจสอบมา
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <ImageHistoryGallery
            images={images}
            onDelete={deleteImageFromHistory}
            isLoading={historyLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
