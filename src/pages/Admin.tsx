// src/pages/Admin.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Leaf,
  Plus,
  Trash2,
  Edit,
  Search as SearchIcon,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Target,
  Filter,
  LayoutDashboard,
  BarChart3,
  Settings,
  Sparkles,
  Bell,
  Menu,
  TrendingDown,
  ImageOff,
  LogOut,
  Grid3x3,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { categories } from "@/data/plants";
import type { Plant } from "@/data/plants";
import { usePlants } from "@/hooks/use-plants";
import { useCategories } from "@/hooks/use-categories";
import { ScientificName } from "@/components/ui/ScientificName";
import { uploadPlantPartImage, uploadPlantImage, deleteImage } from "@/lib/storage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ========================= TYPES ========================= */
type Tab = "dashboard" | "plants" | "statistics";

/* ========================= SIDEBAR ========================= */
const sidebarItems: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "ภาพรวมระบบ", icon: LayoutDashboard },
  { key: "plants", label: "จัดการพรรณไม้", icon: Leaf },
  { key: "statistics", label: "จัดการหมวดหมู่", icon: Grid3x3 },
];

const AdminSidebar = ({ active, onChange, isOpen, onClose }: { active: Tab; onChange: (t: Tab) => void; isOpen?: boolean; onClose?: () => void }) => {
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold leading-tight">PlantAdmin</h1>
          <p className="text-xs text-sidebar-foreground/60">Botanical Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="mb-3 border-b border-sidebar-border pb-3">
          <p className="text-center text-[15px] font-bold tracking-wide text-sidebar-foreground/80">
            ศูนย์จัดการข้อมูลพรรณไม้
          </p>
        </div>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                onChange(item.key);
                if (onClose) onClose();
              }}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarContent />
      </aside>

      {/* Sidebar Drawer */}
      {typeof window !== 'undefined' && (
        <div className={cn(
          "fixed inset-0 z-40",
          isOpen ? "block" : "hidden"
        )}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

/* ========================= HEADER ========================= */
const AdminHeader = ({
  title,
  subtitle,
  onMenuClick,
  onLogout,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 lg:px-8 py-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl lg:text-2xl font-bold tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs lg:text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">ผู้ดูแล</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
            onClick={onLogout}
            title="ออกจากระบบ"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

/* ========================= STAT CARD ========================= */
const toneMap = {
  primary: "bg-[#e2efe9] text-[#1e6f5c]", // green-ish
  accent: "bg-[#fef3c7] text-[#b45309]", // amber
  info: "bg-[#e5f4fd] text-[#1a73e8]", // blue-ish
  success: "bg-green-100 text-green-700",
} as const;

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof toneMap;
  trend?: { value: number; positive?: boolean };
}) => (
  <Card className="relative overflow-hidden border-border/60 bg-gradient-card p-5 shadow-md hover:shadow-elegant transition-all duration-300 group animate-fade-up">
    <div className="relative flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-3xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shadow-sm", toneMap[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="relative mt-4 flex items-center justify-between">
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : <div />}
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            trend.positive ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]",
          )}
        >
          {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend.value}%
        </div>
      )}
    </div>
  </Card>
);

/* ========================= TOP PLANTS CARD ========================= */
const TopPlantsCard = ({ plants }: { plants: Plant[] }) => {
  const topPlants = plants
    .filter((p) => p.updatedAt)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 5);

  return (
    <Card className="border-border/60 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 5 พรรณไม้อัปเดตล่าสุด
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-primary">ชื่อ</TableHead>
                <TableHead className="font-bold text-primary">หมวดหมู่</TableHead>
                <TableHead className="font-bold text-primary">วันที่อัปเดต</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPlants.length > 0 ? (
                topPlants.map((plant, idx) => (
                  <TableRow key={plant.id} className="animate-fade-up" style={{ animationDelay: `${idx * 60}ms`, backgroundColor: idx % 2 === 0 ? "#F5F7F8" : "transparent" }}>
                    <TableCell className="font-medium">{plant.name}</TableCell>
                    <TableCell>{plant.category || "ไม่ระบุ"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {plant.updatedAt ? new Date(plant.updatedAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    ยังไม่มีข้อมูลพรรณไม้
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {topPlants.length > 0 ? (
            topPlants.map((plant, idx) => (
              <div
                key={plant.id}
                className="p-3 border border-border/60 rounded-lg bg-muted/30 animate-fade-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
                        {idx + 1}
                      </span>
                      <p className="font-medium truncate text-sm">{plant.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{plant.category || "ไม่ระบุ"}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {plant.updatedAt ? new Date(plant.updatedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }) : "-"}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8 text-sm">
              ยังไม่มีข้อมูลพรรณไม้
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* ========================= MOBILE TAB BAR ========================= */
const mobileItems: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "หน้าหลัก", icon: LayoutDashboard },
  { key: "plants", label: "พืช", icon: Leaf },
  { key: "statistics", label: "หมวดหมู่", icon: Grid3x3 },
];

const MobileTabBar = ({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) => (
  <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-border bg-background/90 backdrop-blur-xl shadow-elegant">
    <div className="grid grid-cols-4 p-1.5">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-all",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

/* ========================= EDIT MODAL ========================= */
const EditPlantModal = ({
  plant,
  isOpen,
  onClose,
  onSave,
  categoryList = [],
}: {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Plant) => void;
  categoryList?: string[];
}) => {
  const [formData, setFormData] = useState<Partial<Plant>>({
    id: "",
    name: "",
    scientificName: "",
    description: "",
    shortDescription: "",
    image: "",
    category: "",
    reference: "",
    ecology: "",
    benefits: "",
    iucnStatus: "",
    images: {
      flower: "",
      leaf: "",
      fruit: "",
      bark: "",
    },
    characteristics: {
      leaf: "",
      flower: "",
      fruit: "",
      bark: "",
      height: "",
    },
  });
  const [uploadingParts, setUploadingParts] = useState<Record<string, boolean>>({});
  const [partPreview, setPartPreview] = useState<Record<string, string>>({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [mainPreview, setMainPreview] = useState("");

  useEffect(() => {
    if (plant) {
      setFormData({
        id: plant.id || "",
        name: plant.name || "",
        scientificName: plant.scientificName || "",
        description: plant.description || "",
        shortDescription: plant.shortDescription || "",
        image: plant.image || "",
        category: plant.category || "",
        reference: plant.reference || "",
        ecology: plant.ecology || "",
        benefits: plant.benefits || "",
        iucnStatus: plant.iucnStatus || "",
        images: {
          flower: plant.images?.flower || "",
          leaf: plant.images?.leaf || "",
          fruit: plant.images?.fruit || "",
          bark: plant.images?.bark || "",
        },
        characteristics: {
          leaf: plant.characteristics?.leaf || "",
          flower: plant.characteristics?.flower || "",
          fruit: plant.characteristics?.fruit || "",
          bark: plant.characteristics?.bark || "",
          height: plant.characteristics?.height || "",
        },
      });
      setPartPreview({});
      setMainPreview("");
    }
  }, [plant]);

  if (!plant) return null;

  const handleChange = (field: keyof Plant, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCharacteristicChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...(prev.characteristics || {}),
        [field]: value,
      } as any,
    }));
  };

  const handleImagePartUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    partType: 'flower' | 'leaf' | 'fruit' | 'bark'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !formData.id) {
      toast.error("ไม่สามารถอัปโหลดได้", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPartPreview((prev) => ({
        ...prev,
        [partType]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    try {
      setUploadingParts((prev) => ({ ...prev, [partType]: true }));
      
      // Delete old image if exists
      if (formData.images?.[partType]) {
        try {
          const oldUrl = formData.images[partType];
          const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const oldPath = decodeURIComponent(pathMatch[1]);
            await deleteImage(oldPath);
          }
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }
      
      const url = await uploadPlantPartImage(file, formData.id, partType);
      setFormData((prev) => ({
        ...prev,
        images: {
          ...(prev.images || {}),
          [partType]: url,
        },
      }));
      toast.success(`อัปโหลดรูป${partType === 'flower' ? 'ดอก' : partType === 'leaf' ? 'ใบ' : partType === 'fruit' ? 'ผล' : 'เปลือก'}สำเร็จ`, {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error(`Error uploading ${partType}:`, error);
      toast.error(`เกิดข้อผิดพลาดในการอัปโหลด`, {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } finally {
      setUploadingParts((prev) => ({ ...prev, [partType]: false }));
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.id) {
      toast.error("ไม่สามารถอัปโหลดได้", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    try {
      setUploadingMain(true);
      
      // Delete old image if exists
      if (formData.image && typeof formData.image === 'string') {
        try {
          const oldUrl = formData.image;
          const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const oldPath = decodeURIComponent(pathMatch[1]);
            await deleteImage(oldPath);
          }
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }
      
      const url = await uploadPlantImage(file, formData.id);
      setFormData((prev) => ({
        ...prev,
        image: url,
      }));
      toast.success("อัปโหลดรูปหลักสำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error("Error uploading main image:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูปหลัก", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } finally {
      setUploadingMain(false);
    }
  };

  const handleDeleteMainImage = async () => {
    if (!formData.image || typeof formData.image !== 'string') return;
    
    try {
      const oldUrl = formData.image;
      const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const oldPath = decodeURIComponent(pathMatch[1]);
        await deleteImage(oldPath);
      }
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
      setMainPreview("");
      toast.success("ลบรูปหลักสำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error("Error deleting main image:", error);
      toast.error("เกิดข้อผิดพลาดในการลบรูป", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const handleDeletePartImage = async (partType: 'flower' | 'leaf' | 'fruit' | 'bark') => {
    if (!formData.images?.[partType]) return;
    
    try {
      const oldUrl = formData.images[partType];
      const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const oldPath = decodeURIComponent(pathMatch[1]);
        await deleteImage(oldPath);
      }
      setFormData((prev) => ({
        ...prev,
        images: {
          ...(prev.images || {}),
          [partType]: "",
        },
      }));
      setPartPreview((prev) => {
        const newPreview = { ...prev };
        delete newPreview[partType];
        return newPreview;
      });
      toast.success("ลบรูปสำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error(`Error deleting ${partType} image:`, error);
      toast.error("เกิดข้อผิดพลาดในการลบรูป", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const PartImageUploader = ({ partType, label }: { partType: 'flower' | 'leaf' | 'fruit' | 'bark'; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-3 items-end">
        <div className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30 overflow-hidden flex-shrink-0">
          {partPreview[partType] ? (
            <img
              src={partPreview[partType]}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : formData.images?.[partType] ? (
            <img
              src={formData.images[partType]}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImagePartUpload(e, partType)}
              disabled={uploadingParts[partType]}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              disabled={uploadingParts[partType]}
              asChild
            >
              <span>
                {uploadingParts[partType] ? "กำลังอัปโหลด..." : "เลือกรูป"}
              </span>
            </Button>
          </label>
          {formData.images?.[partType] && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleDeletePartImage(partType)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const handleSave = () => {
    if (!formData.name || !formData.scientificName || !formData.category) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน", {
        position: "bottom-right",
        style: {
          background: "#FAE251",
          color: "#000",
          borderColor: "#F0D642",
        },
      });
      return;
    }
    onSave(formData as Plant);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Leaf className="h-5 w-5 text-primary" />
            แก้ไขข้อมูลพรรณไม้
          </DialogTitle>
          <p className="text-sm text-muted-foreground">ปรับปรุงข้อมูลของ {plant.name}</p>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 shrink-0 rounded-xl border flex items-center justify-center bg-muted overflow-hidden">
              {mainPreview ? (
                <img src={mainPreview} alt="Main Preview" className="w-full h-full object-cover" />
              ) : formData.image && typeof formData.image === "string" ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>รูปภาพหลัก</Label>
              <div className="flex gap-2">
                <label className="flex-1 block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImageUpload}
                    disabled={uploadingMain}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    disabled={uploadingMain}
                    asChild
                  >
                    <span>
                      {uploadingMain ? "กำลังอัปโหลด..." : "เลือกรูป"}
                    </span>
                  </Button>
                </label>
                {formData.image && typeof formData.image === "string" && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteMainImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>ชื่อ <span className="text-destructive">*</span></Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ชื่อวิทยาศาสตร์ <span className="text-destructive">*</span></Label>
            <Input
              value={formData.scientificName || ""}
              onChange={(e) => handleChange("scientificName", e.target.value)}
              className="italic"
            />
          </div>

          <div className="space-y-2">
            <Label>คำอธิบายสั้น</Label>
            <Textarea
              className="resize-none h-16"
              placeholder="คำอธิบายสั้น ๆ (1-2 บรรทัด)"
              value={formData.shortDescription || ""}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>หมวดหมู่ <span className="text-destructive">*</span></Label>
            <Select
              value={formData.category || ""}
              onValueChange={(val) => handleChange("category", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {(categoryList && categoryList.length > 0 ? categoryList : categories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-base">รูปถ่ายส่วนต่าง ๆ ของพรรณไม้</Label>
            <div className="grid grid-cols-2 gap-4">
              <PartImageUploader partType="leaf" label="รูปใบ" />
              <PartImageUploader partType="flower" label="รูปดอก" />
              <PartImageUploader partType="fruit" label="รูปผล" />
              <PartImageUploader partType="bark" label="รูปเปลือก" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>รายละเอียด</Label>
            <Textarea
              className="resize-none h-24"
              placeholder="ลักษณะเด่น สรรพคุณ การดูแล ฯลฯ"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ความสูง</Label>
            <Input
              value={formData.characteristics?.height || ""}
              onChange={(e) => handleCharacteristicChange("height", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>ลักษณะของใบ</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.leaf || ""}
                onChange={(e) => handleCharacteristicChange("leaf", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลักษณะของดอกไม้</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.flower || ""}
                onChange={(e) => handleCharacteristicChange("flower", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลักษณะของผล</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.fruit || ""}
                onChange={(e) => handleCharacteristicChange("fruit", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลักษณะของเปลือก</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.bark || ""}
                onChange={(e) => handleCharacteristicChange("bark", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>นิเวศวิทยาและการกระจายพันธุ์</Label>
            <Textarea
              className="resize-none h-20"
              placeholder="อธิบายข้อมูลเกี่ยวกับสภาพแวดล้อม ที่อยู่อาศัย และพื้นที่ที่พบของพรรณไม้"
              value={formData.ecology || ""}
              onChange={(e) => handleChange("ecology", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ประโยชน์/โทษ</Label>
            <Textarea
              className="resize-none h-20"
              placeholder="ประโยชน์ที่ได้รับจากพรรณไม้ และความเสี่ยงหรือโทษที่อาจเกิดขึ้น"
              value={formData.benefits || ""}
              onChange={(e) => handleChange("benefits", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>สถานะการอนุรักษ์ IUCN Red List 2022</Label>
            <Select
              value={formData.iucnStatus || ""}
              onValueChange={(val) => handleChange("iucnStatus", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสถานะการอนุรักษ์" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Extinct">สูญพันธุ์ (Extinct - EX)</SelectItem>
                <SelectItem value="Extinct in the Wild">สูญพันธุ์ในถิ่นกำเนิด (Extinct in the Wild - EW)</SelectItem>
                <SelectItem value="Critically Endangered">วิกฤตอย่างยิ่ง (Critically Endangered - CR)</SelectItem>
                <SelectItem value="Endangered">วิกฤต (Endangered - EN)</SelectItem>
                <SelectItem value="Vulnerable">เสี่ยงวิกฤต (Vulnerable - VU)</SelectItem>
                <SelectItem value="Near Threatened">ใกล้เสี่ยงวิกฤต (Near Threatened - NT)</SelectItem>
                <SelectItem value="Least Concern">ไม่เสี่ยง (Least Concern - LC)</SelectItem>
                <SelectItem value="Data Deficient">ข้อมูลไม่พอ (Data Deficient - DD)</SelectItem>
                <SelectItem value="Not Evaluated">ยังไม่ได้ประเมิน (Not Evaluated - NE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>อ้างอิง</Label>
            <Textarea
              className="resize-none h-20"
              placeholder="แหล่งที่มาข้อมูล และแหล่งที่มาของภาพ (สามารถระบุ URL หรือชื่อแหล่งที่มา)"
              value={formData.reference || ""}
              onChange={(e) => handleChange("reference", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={Object.values(uploadingParts).some(v => v) || uploadingMain}>
            ยกเลิก
          </Button>
          <Button 
            className="bg-[#1a5f4a] hover:bg-[#1a5f4a] text-white" 
            onClick={handleSave}
            disabled={Object.values(uploadingParts).some(v => v) || uploadingMain}
          >
            บันทึกการแก้ไข
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ========================= ADD PLANT MODAL ========================= */
const AddPlantModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  categoryList = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Plant) => Promise<void>;
  isLoading?: boolean;
  categoryList?: string[];
}) => {
  const [formData, setFormData] = useState<Partial<Plant>>({
    id: "",
    name: "",
    scientificName: "",
    description: "",
    shortDescription: "",
    image: "",
    category: "ทั้งหมด",
    reference: "",
    ecology: "",
    benefits: "",
    iucnStatus: "",
    images: {
      flower: "",
      leaf: "",
      fruit: "",
      bark: "",
    },
    characteristics: {
      leaf: "",
      flower: "",
      fruit: "",
      bark: "",
      height: "",
    },
  });

  const [uploadingParts, setUploadingParts] = useState<Record<string, boolean>>({});
  const [partPreview, setPartPreview] = useState<Record<string, string>>({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [mainPreview, setMainPreview] = useState("");

  const handleChange = (field: keyof Plant, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCharacteristicChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...(prev.characteristics || {}),
        [field]: value,
      } as any,
    }));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.id) {
      toast.error("กรุณากรอก ID ของพรรณไม้ก่อน", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    try {
      setUploadingMain(true);
      
      // Delete old image if exists
      if (formData.image && typeof formData.image === 'string') {
        try {
          const oldUrl = formData.image;
          const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const oldPath = decodeURIComponent(pathMatch[1]);
            await deleteImage(oldPath);
          }
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }
      
      const url = await uploadPlantImage(file, formData.id);
      setFormData((prev) => ({
        ...prev,
        image: url,
      }));
      toast.success("อัปโหลดรูปหลักสำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error("Error uploading main image:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูปหลัก", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } finally {
      setUploadingMain(false);
    }
  };

  const handleImagePartUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    partType: 'flower' | 'leaf' | 'fruit' | 'bark'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !formData.id) {
      toast.error("กรุณากรอก ID ของพรรณไม้ก่อน", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPartPreview((prev) => ({
        ...prev,
        [partType]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    try {
      setUploadingParts((prev) => ({ ...prev, [partType]: true }));
      
      // Delete old image if exists
      if (formData.images?.[partType]) {
        try {
          const oldUrl = formData.images[partType];
          const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const oldPath = decodeURIComponent(pathMatch[1]);
            await deleteImage(oldPath);
          }
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }
      
      const url = await uploadPlantPartImage(file, formData.id, partType);
      setFormData((prev) => ({
        ...prev,
        images: {
          ...(prev.images || {}),
          [partType]: url,
        },
      }));
      toast.success(`อัปโหลดรูป${partType === 'flower' ? 'ดอก' : partType === 'leaf' ? 'ใบ' : partType === 'fruit' ? 'ผล' : 'เปลือก'}สำเร็จ`, {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error(`Error uploading ${partType}:`, error);
      toast.error(`เกิดข้อผิดพลาดในการอัปโหลดรูป${partType === 'flower' ? 'ดอก' : partType === 'leaf' ? 'ใบ' : partType === 'fruit' ? 'ผล' : 'เปลือก'}`, {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } finally {
      setUploadingParts((prev) => ({ ...prev, [partType]: false }));
    }
  };

  const handleDeleteMainImage = async () => {
    if (!formData.image || typeof formData.image !== 'string') return;
    
    try {
      const oldUrl = formData.image;
      const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const oldPath = decodeURIComponent(pathMatch[1]);
        await deleteImage(oldPath);
      }
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
      setMainPreview("");
      toast.success("ลบรูปหลักสำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error("Error deleting main image:", error);
      toast.error("เกิดข้อผิดพลาดในการลบรูป", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const handleDeletePartImage = async (partType: 'flower' | 'leaf' | 'fruit' | 'bark') => {
    if (!formData.images?.[partType]) return;
    
    try {
      const oldUrl = formData.images[partType];
      const pathMatch = oldUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const oldPath = decodeURIComponent(pathMatch[1]);
        await deleteImage(oldPath);
      }
      setFormData((prev) => ({
        ...prev,
        images: {
          ...(prev.images || {}),
          [partType]: "",
        },
      }));
      setPartPreview((prev) => {
        const newPreview = { ...prev };
        delete newPreview[partType];
        return newPreview;
      });
      toast.success("ลบรูปสำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (error) {
      console.error(`Error deleting ${partType} image:`, error);
      toast.error("เกิดข้อผิดพลาดในการลบรูป", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const PartImageUploader = ({ partType, label }: { partType: 'flower' | 'leaf' | 'fruit' | 'bark'; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-3 items-end">
        <div className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30 overflow-hidden flex-shrink-0">
          {partPreview[partType] ? (
            <img
              src={partPreview[partType]}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : formData.images?.[partType] ? (
            <img
              src={formData.images[partType]}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
          )}
        </div>
        <div className="flex-1 flex gap-2 items-end">
          <label className="flex-1 block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImagePartUpload(e, partType)}
              disabled={uploadingParts[partType]}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              disabled={uploadingParts[partType]}
              asChild
            >
              <span>
                {uploadingParts[partType] ? "กำลังอัปโหลด..." : "เลือกรูป"}
              </span>
            </Button>
          </label>
          {formData.images?.[partType] && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleDeletePartImage(partType)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const handleSave = async () => {
    if (!formData.id || !formData.name || !formData.scientificName || !formData.category) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน", {
        position: "bottom-right",
        style: {
          background: "#FAE251",
          color: "#000",
          borderColor: "#F0D642",
        },
      });
      return;
    }

    try {
      await onSave(formData as Plant);
      setFormData({
        id: "",
        name: "",
        scientificName: "",
        description: "",
        shortDescription: "",
        image: "",
        category: "",
        reference: "",
        ecology: "",
        benefits: "",
        iucnStatus: "",
        images: {
          flower: "",
          leaf: "",
          fruit: "",
          bark: "",
        },
        characteristics: {
          leaf: "",
          flower: "",
          fruit: "",
          bark: "",
          height: "",
        },
      });
      setPartPreview({});
      setMainPreview("");
      onClose();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", {
        position: "bottom-right",
        style: {
          background: "#FAE251",
          color: "#000",
          borderColor: "#F0D642",
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Plus className="h-5 w-5 text-primary" />
            เพิ่มพรรณไม้ใหม่
          </DialogTitle>
          <p className="text-sm text-muted-foreground">เพิ่มข้อมูลพรรณไม้ใหม่เข้าระบบ</p>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          <div className="space-y-2">
            <Label>ID (รหัสประจำตัว) <span className="text-destructive">*</span></Label>
            <Input
              placeholder="เช่น taku, lavender"
              value={formData.id || ""}
              onChange={(e) => handleChange("id", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">ไม่เว้นวรรค หรือใช้เครื่องหมายพิเศษ</p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 shrink-0 rounded-xl border flex items-center justify-center bg-muted overflow-hidden">
              {mainPreview ? (
                <img src={mainPreview} alt="Main Preview" className="w-full h-full object-cover" />
              ) : formData.image && typeof formData.image === "string" ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>รูปภาพหลัก</Label>
              <div className="flex gap-2">
                <label className="flex-1 block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImageUpload}
                    disabled={uploadingMain}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    disabled={uploadingMain}
                    asChild
                  >
                    <span>
                      {uploadingMain ? "กำลังอัปโหลด..." : "เลือกรูป"}
                    </span>
                  </Button>
                </label>
                {formData.image && typeof formData.image === "string" && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteMainImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>ชื่อ <span className="text-destructive">*</span></Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ชื่อวิทยาศาสตร์ <span className="text-destructive">*</span></Label>
            <Input
              value={formData.scientificName || ""}
              onChange={(e) => handleChange("scientificName", e.target.value)}
              className="italic"
            />
          </div>

          <div className="space-y-2">
            <Label>คำอธิบายสั้น</Label>
            <Textarea
              className="resize-none h-16"
              placeholder="คำอธิบายสั้น ๆ (1-2 บรรทัด)"
              value={formData.shortDescription || ""}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>หมวดหมู่ <span className="text-destructive">*</span></Label>
            <Select
              value={formData.category || ""}
              onValueChange={(val) => handleChange("category", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {(categoryList && categoryList.length > 0 ? categoryList : categories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-base">รูปถ่ายส่วนต่าง ๆ ของพรรณไม้</Label>
            <div className="grid grid-cols-2 gap-4">
              <PartImageUploader partType="leaf" label="รูปใบ" />
              <PartImageUploader partType="flower" label="รูปดอก" />
              <PartImageUploader partType="fruit" label="รูปผล" />
              <PartImageUploader partType="bark" label="รูปเปลือก" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>รายละเอียด</Label>
            <Textarea
              className="resize-none h-24"
              placeholder="ลักษณะเด่น สรรพคุณ การดูแล ฯลฯ"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ความสูง</Label>
            <Input
              value={formData.characteristics?.height || ""}
              onChange={(e) => handleCharacteristicChange("height", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>ลักษณะของใบ</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.leaf || ""}
                onChange={(e) => handleCharacteristicChange("leaf", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลักษณะของดอกไม้</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.flower || ""}
                onChange={(e) => handleCharacteristicChange("flower", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลักษณะของผล</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.fruit || ""}
                onChange={(e) => handleCharacteristicChange("fruit", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลักษณะของเปลือก</Label>
              <Textarea
                className="resize-none h-16"
                value={formData.characteristics?.bark || ""}
                onChange={(e) => handleCharacteristicChange("bark", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>นิเวศวิทยาและการกระจายพันธุ์</Label>
            <Textarea
              className="resize-none h-20"
              placeholder="อธิบายข้อมูลเกี่ยวกับสภาพแวดล้อม ที่อยู่อาศัย และพื้นที่ที่พบของพรรณไม้"
              value={formData.ecology || ""}
              onChange={(e) => handleChange("ecology", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ประโยชน์/โทษ</Label>
            <Textarea
              className="resize-none h-20"
              placeholder="ประโยชน์ที่ได้รับจากพรรณไม้ และความเสี่ยงหรือโทษที่อาจเกิดขึ้น"
              value={formData.benefits || ""}
              onChange={(e) => handleChange("benefits", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>สถานะการอนุรักษ์ IUCN Red List 2022</Label>
            <Select
              value={formData.iucnStatus || ""}
              onValueChange={(val) => handleChange("iucnStatus", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสถานะการอนุรักษ์" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Extinct">สูญพันธุ์ (Extinct - EX)</SelectItem>
                <SelectItem value="Extinct in the Wild">สูญพันธุ์ในถิ่นกำเนิด (Extinct in the Wild - EW)</SelectItem>
                <SelectItem value="Critically Endangered">วิกฤตอย่างยิ่ง (Critically Endangered - CR)</SelectItem>
                <SelectItem value="Endangered">วิกฤต (Endangered - EN)</SelectItem>
                <SelectItem value="Vulnerable">เสี่ยงวิกฤต (Vulnerable - VU)</SelectItem>
                <SelectItem value="Near Threatened">ใกล้เสี่ยงวิกฤต (Near Threatened - NT)</SelectItem>
                <SelectItem value="Least Concern">ไม่เสี่ยง (Least Concern - LC)</SelectItem>
                <SelectItem value="Data Deficient">ข้อมูลไม่พอ (Data Deficient - DD)</SelectItem>
                <SelectItem value="Not Evaluated">ยังไม่ได้ประเมิน (Not Evaluated - NE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>อ้างอิง</Label>
            <Textarea
              className="resize-none h-20"
              placeholder="แหล่งที่มาข้อมูล และแหล่งที่มาของภาพ (สามารถระบุ URL หรือชื่อแหล่งที่มา)"
              value={formData.reference || ""}
              onChange={(e) => handleChange("reference", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading || Object.values(uploadingParts).some(v => v) || uploadingMain}>
            ยกเลิก
          </Button>
          <Button 
            className="bg-[#1a5f4a] hover:bg-[#1a5f4a] text-white" 
            onClick={handleSave}
            disabled={isLoading || Object.values(uploadingParts).some(v => v) || uploadingMain}
          >
            {isLoading ? "กำลังบันทึก..." : "เพิ่มพรรณไม้"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ========================= MAIN PAGE ========================= */
const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAdminAuth();
  const { plants, removePlant, updatePlant, addPlant } = usePlants();
  const { categories: categoryList, addCategory, deleteCategory, updateCategory } = useCategories();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ index: number; name: string } | null>(null);

  // Define useMemo BEFORE early returns
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "ทั้งหมด" || plant.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [plants, searchTerm, selectedCategory]);

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("ออกจากระบบสำเร็จ");
      navigate("/admin-login");
    } catch (error) {
      toast.error("ออกจากระบบล้มเหลว");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Leaf className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Category management handlers
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      if (categoryList.includes(newCategory.trim())) {
        toast.error("หมวดหมู่นี้มีอยู่แล้ว", {
          position: "bottom-right",
          style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
        });
        return;
      }
      
      await addCategory(newCategory.trim());
      setNewCategory("");
      toast.success("เพิ่มหมวดหมู่สำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      const oldName = categoryList[editingCategory.index];
      const newName = editingCategory.name.trim();
      
      if (!newName) return;
      if (oldName === newName) {
        setEditingCategory(null);
        return;
      }
      if (categoryList.includes(newName)) {
        toast.error("หมวดหมู่นี้มีอยู่แล้ว", {
          position: "bottom-right",
          style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
        });
        return;
      }
      
      await updateCategory(oldName, newName);
      setEditingCategory(null);
      toast.success("อัปเดตหมวดหมู่สำเร็จ", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const handleDeleteCategory = async (idx: number) => {
    try {
      const catName = categoryList[idx];
      if (catName === "ทั้งหมด") {
        toast.error("ไม่สามารถลบหมวดหมู่ \"ทั้งหมด\" ได้", {
          position: "bottom-right",
          style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
        });
        return;
      }
      
      await deleteCategory(catName);
      toast.success(`ลบหมวดหมู่ "${catName}" แล้ว`, {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("เกิดข้อผิดพลาดในการลบหมวดหมู่", {
        position: "bottom-right",
        style: { background: "#FAE251", color: "#000", borderColor: "#F0D642" },
      });
    }
  };

  const titleMap: Record<Tab, { title: string; subtitle: string }> = {
    dashboard: { title: "ภาพรวมระบบ", subtitle: "ภาพรวมการใช้งานระบบจำแนกพรรณไม้" },
    plants: { title: "จัดการพรรณไม้", subtitle: "เพิ่ม แก้ไข และลบข้อมูลพรรณไม้ในระบบ" },
    statistics: { title: "จัดการหมวดหมู่", subtitle: "เพิ่ม แก้ไข และลบหมวดหมู่พรรณไม้" },
  };

  return (
    <div className="flex min-h-screen bg-gradient-surface">
      <AdminSidebar active={activeTab} onChange={setActiveTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={titleMap[activeTab].title}
          subtitle={titleMap[activeTab].subtitle}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard 
                  label="วันที่อัปเดตล่าสุด" 
                  value={
                    plants.length > 0 && plants.some(p => p.updatedAt)
                      ? new Date(Math.max(...plants.filter(p => p.updatedAt).map(p => p.updatedAt || 0))).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "ไม่มีข้อมูล"
                  } 
                  hint="ของข้อมูลพรรณไม้" 
                  icon={ImageIcon} 
                  tone="primary" 
                />
                <StatCard 
                  label="จำนวนหมวดหมู่" 
                  value={(categoryList && categoryList.length > 0 ? categoryList.length : 0)} 
                  hint="ในระบบทั้งหมด" 
                  icon={Target} 
                  tone="info" 
                />
                <StatCard label="พรรณไม้" value={plants.length} hint="ในระบบทั้งหมด" icon={Leaf} tone="accent" />
              </div>
              <TopPlantsCard plants={plants} />
            </>
          )}

          {activeTab === "plants" && (
            <>
              <Card className="border-border/60 shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1 min-w-0">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ค้นหาด้วยชื่อ หรือชื่อวิทยาศาสตร์"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11 w-full lg:w-56 shrink-0">
                        <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(categoryList && categoryList.length > 0 ? categoryList : categories).map((cat) => (
                          <SelectItem 
                            key={cat} 
                            value={cat}
                            className="cursor-pointer data-[state=checked]:text-foreground data-[state=checked]:font-medium mb-1"
                          >
                            {cat === "ทั้งหมด" ? "ทุกหมวดหมู่" : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      className="w-full lg:w-auto bg-[#1a5f4a] hover:bg-[#1a5f4a] text-white font-semibold gap-2 h-11 shrink-0"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      เพิ่มพรรณไม้
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-md overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="font-display text-lg">รายการพรรณไม้</CardTitle>
                  <Badge variant="secondary" className="font-mono">
                   ทั้งหมด {filteredPlants.length} รายการ
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredPlants.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <Leaf className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>ไม่พบผลการค้นหา</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent border-border bg-white">
                              <TableHead className="pl-6 font-bold text-[#1a5f4a]">ชื่อพรรณไม้</TableHead>
                              <TableHead className="font-bold text-[#1a5f4a]">ชื่อวิทยาศาสตร์</TableHead>
                              <TableHead className="text-center font-bold text-[#1a5f4a]">หมวดหมู่</TableHead>
                              <TableHead className="text-right pr-6 font-bold text-[#1a5f4a]">จัดการ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPlants.map((plant, idx) => (
                              <TableRow key={plant.id} className="border-border" style={{ backgroundColor: idx % 2 === 0 ? "#F5F7F8" : "transparent" }}>
                                <TableCell className="pl-6 font-medium">
                                  {plant.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  <ScientificName name={plant.scientificName} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="font-normal justify-center" style={{ borderColor: "#D3DAD9" }}>
                                    {plant.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                  <div className="inline-flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 hover:text-primary"
                                      onClick={() => setEditingPlant(plant)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 hover:text-destructive"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            คุณต้องการลบข้อมูล "{plant.name}" ใช่หรือไม่?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={async () => {
                                              try {
                                                await removePlant(plant.id);
                                                toast.success(`ลบ ${plant.name} แล้ว`, {
                                                  position: "bottom-right",
                                                  style: {
                                                    background: "#FAE251",
                                                    color: "#000",
                                                    borderColor: "#F0D642",
                                                  },
                                                });
                                              } catch (error) {
                                                toast.error(`เกิดข้อผิดพลาดในการลบ ${plant.name}`, {
                                                  position: "bottom-right",
                                                  style: {
                                                    background: "#FAE251",
                                                    color: "#000",
                                                    borderColor: "#F0D642",
                                                  },
                                                });
                                              }
                                            }}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            ยืนยัน
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="md:hidden space-y-3 p-4">
                        {filteredPlants.map((plant) => (
                          <div
                            key={plant.id}
                            className="p-4 border border-border/60 rounded-lg bg-muted/30 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-sm">{plant.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <ScientificName name={plant.scientificName} />
                                </p>
                              </div>
                              <Badge variant="outline" className="font-normal shrink-0">
                                {plant.category}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setEditingPlant(plant)}
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                แก้ไข
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    ลบ
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      คุณต้องการลบข้อมูล "{plant.name}" ใช่หรือไม่?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={async () => {
                                        try {
                                          await removePlant(plant.id);
                                          toast.success(`ลบ ${plant.name} แล้ว`, {
                                            position: "bottom-right",
                                            style: {
                                              background: "#FAE251",
                                              color: "#000",
                                              borderColor: "#F0D642",
                                            },
                                          });
                                        } catch (error) {
                                          toast.error(`เกิดข้อผิดพลาดในการลบ ${plant.name}`, {
                                            position: "bottom-right",
                                            style: {
                                              background: "#FAE251",
                                              color: "#000",
                                              borderColor: "#F0D642",
                                            },
                                          });
                                        }
                                      }}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      ยืนยัน
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "statistics" && (
            <>
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Grid3x3 className="h-5 w-5 text-primary" />
                    เพิ่มหมวดหมู่ใหม่
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="ชื่อหมวดหมู่ใหม่..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newCategory.trim()) {
                          handleAddCategory();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      className="bg-[#1a5f4a] hover:bg-[#1a5f4a] text-white font-semibold gap-2 h-11 shrink-0"
                      onClick={handleAddCategory}
                    >
                      <Plus className="h-4 w-4" />
                      เพิ่ม
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Grid3x3 className="h-5 w-5 text-primary" />
                    รายการหมวดหมู่ ({categoryList.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingCategory ? (
                    <div className="flex gap-2 mb-4">
                      <Input
                        autoFocus
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateCategory();
                          }
                        }}
                      />
                      <Button
                        className="bg-[#1a5f4a] hover:bg-[#1a5f4a] text-white font-semibold"
                        onClick={handleUpdateCategory}
                      >
                        บันทึก
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingCategory(null)}
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryList.map((cat, idx) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition"
                      >
                        <span className="font-medium text-sm">{cat}</span>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:text-blue-600"
                            onClick={() => setEditingCategory({ index: idx, name: cat })}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>ยืนยันการลบหมวดหมู่</AlertDialogTitle>
                                <AlertDialogDescription>
                                  คุณต้องการลบหมวดหมู่ "{cat}" ใช่หรือไม่?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(idx)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  ลบ
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                  {categoryList.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Grid3x3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>ยังไม่มีหมวดหมู่ ให้เพิ่มหมวดหมู่ใหม่</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>

      <MobileTabBar active={activeTab} onChange={setActiveTab} />
      <EditPlantModal 
        plant={editingPlant}
        isOpen={!!editingPlant}
        onClose={() => setEditingPlant(null)}
        categoryList={categoryList}
        onSave={async (updatedPlant) => {
          if (updatePlant) {
            try {
              await updatePlant(updatedPlant);
              toast.success("อัปเดตข้อมูลพรรณไม้สำเร็จ", {
                position: "bottom-right",
                style: {
                  background: "#FAE251",
                  color: "#000",
                  borderColor: "#F0D642",
                },
              });
            } catch (error) {
              toast.error("เกิดข้อผิดพลาดในการอัปเดต", {
                position: "bottom-right",
                style: {
                  background: "#FAE251",
                  color: "#000",
                  borderColor: "#F0D642",
                },
              });
            }
          }
        }}
      />
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categoryList={categoryList}
        onSave={async (newPlant) => {
          if (addPlant) {
            try {
              setIsSaving(true);
              await addPlant(newPlant);
              toast.success("เพิ่มพรรณไม้สำเร็จ", {
                position: "bottom-right",
                style: {
                  background: "#FAE251",
                  color: "#000",
                  borderColor: "#F0D642",
                },
              });
            } catch (error) {
              console.error("Error adding plant:", error);
              toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", {
                position: "bottom-right",
                style: {
                  background: "#FAE251",
                  color: "#000",
                  borderColor: "#F0D642",
                },
              });
            } finally {
              setIsSaving(false);
            }
          }
        }}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Admin;
