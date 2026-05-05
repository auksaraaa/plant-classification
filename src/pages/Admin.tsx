// src/pages/Admin.tsx
import { useMemo, useState, useEffect } from "react";
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
  LogOut,
  Menu,
  TrendingDown,
  ImageOff,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ScientificName } from "@/components/ui/ScientificName";

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
type Tab = "dashboard" | "plants" | "statistics" | "settings";

/* ========================= SIDEBAR ========================= */
const sidebarItems: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { key: "plants", label: "จัดการพรรณไม้", icon: Leaf },
  { key: "statistics", label: "สถิติการใช้งาน", icon: BarChart3 },
  { key: "settings", label: "ตั้งค่าระบบ", icon: Settings },
];

const AdminSidebar = ({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) => (
  <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
    <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
        <Leaf className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-display text-lg font-bold leading-tight">PlantAdmin</h1>
        <p className="text-xs text-sidebar-foreground/60">Botanical Console</p>
      </div>
    </div>

    <nav className="flex-1 px-3 py-6 space-y-1">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
        เมนูหลัก
      </p>
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
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
  </aside>
);

/* ========================= HEADER ========================= */
const AdminHeader = ({
  title,
  subtitle,
  userName,
  isLoggedIn,
  onLogout,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  userName?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onMenuClick?: () => void;
}) => {
  const initials = (userName ?? "AD").slice(0, 2).toUpperCase();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 lg:px-8 py-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
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
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">{userName || "ผู้ดูแล"}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          {isLoggedIn && (
            <Button variant="ghost" size="icon" onClick={onLogout} title="ออกจากระบบ">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
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
  <Card className="relative overflow-hidden border-border/60 bg-gradient-card p-5 shadow-sm hover:shadow-elegant transition-all duration-300 group animate-fade-up">
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
const TopPlantsCard = ({ plants }: { plants: { name: string; count: number }[] }) => {
  const max = Math.max(...plants.map((p) => p.count));
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 5 พรรณไม้ยอดนิยม
          </CardTitle>
          <span className="text-xs text-muted-foreground">7 วันล่าสุด</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {plants.map((plant, idx) => {
          const pct = (plant.count / max) * 100;
          return (
            <div key={plant.name} className="space-y-1.5 animate-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-xs font-bold text-primary-foreground shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-sm truncate">{plant.name}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {plant.count.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-all"
                  style={{ width: `${pct}%`, animation: `slideIn 0.8s ease-out ${idx * 80}ms both` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

/* ========================= MOBILE TAB BAR ========================= */
const mobileItems: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "หน้าหลัก", icon: LayoutDashboard },
  { key: "plants", label: "พืช", icon: Leaf },
  { key: "statistics", label: "สถิติ", icon: BarChart3 },
  { key: "settings", label: "ตั้งค่า", icon: Settings },
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
}: {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Plant) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Plant>>({});

  useEffect(() => {
    if (plant) {
      setFormData({
        ...plant,
      });
    }
  }, [plant]);

  if (!plant) return null;

  const handleChange = (field: keyof Plant, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
            แก้ไขข้อมูลพันธุ์ไม้
          </DialogTitle>
          <p className="text-sm text-muted-foreground">ปรับปรุงข้อมูลของ {plant.name}</p>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 shrink-0 rounded-xl border flex items-center justify-center bg-muted overflow-hidden">
              {formData.image && typeof formData.image === "string" ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>URL รูปภาพ</Label>
              <Input
                placeholder="https://..."
                value={typeof formData.image === "string" ? formData.image : ""}
                onChange={(e) => handleChange("image", e.target.value)}
              />
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
            <Label>หมวดหมู่ <span className="text-destructive">*</span></Label>
            <Select
              value={formData.category || ""}
              onValueChange={(val) => handleChange("category", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button className="bg-[#319b5d] hover:bg-[#28844f] text-white" onClick={handleSave}>
            บันทึกการแก้ไข
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ========================= MAIN PAGE ========================= */
const Admin = () => {
  const { plants, removePlant, updatePlant } = usePlants();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const stats = {
    todayClassifications: 24,
    totalClassifications: 1542,
    usersToday: 12,
    totalUsers: 256,
    topPlants: [
      { name: "ตะกู", count: 245 },
      { name: "ลาเวนเดอร์", count: 187 },
      { name: "ว่านหางจระเข้", count: 156 },
      { name: "ลิลี่สงบ", count: 142 },
      { name: "ยาง", count: 128 },
    ],
  };

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

  const titleMap: Record<Tab, { title: string; subtitle: string }> = {
    dashboard: { title: "แดชบอร์ด", subtitle: "ภาพรวมการใช้งานระบบจำแนกพรรณไม้วันนี้" },
    plants: { title: "จัดการพรรณไม้", subtitle: "เพิ่ม แก้ไข และลบข้อมูลพรรณไม้ในระบบ" },
    statistics: { title: "สถิติการใช้งาน", subtitle: "วิเคราะห์พฤติกรรมผู้ใช้และประสิทธิภาพระบบ" },
    settings: { title: "ตั้งค่าระบบ", subtitle: "จัดการการตั้งค่าและความปลอดภัย" },
  };

  return (
    <div className="flex min-h-screen bg-gradient-surface">
      <AdminSidebar active={activeTab} onChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={titleMap[activeTab].title}
          subtitle={titleMap[activeTab].subtitle}
          userName="ผู้ดูแล"
        />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="จำแนกวันนี้" value={stats.todayClassifications} hint="รูปภาพที่ส่งเข้ามา" icon={ImageIcon} tone="primary" trend={{ value: 12, positive: true }} />
                <StatCard label="จำแนกทั้งหมด" value={stats.totalClassifications.toLocaleString()} hint="ตั้งแต่เริ่มใช้งาน" icon={Target} tone="info" trend={{ value: 8, positive: true }} />
                <StatCard label="พรรณไม้" value={plants.length} hint="ในระบบทั้งหมด" icon={Leaf} tone="accent" />
              </div>
              <TopPlantsCard plants={stats.topPlants} />
            </>
          )}

          {activeTab === "plants" && (
            <>
              <Card className="border-border/60 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1 min-w-0">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ค้นหาด้วยชื่อหรือชื่อวิทยาศาสตร์..."
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
                        {categories.map((cat) => (
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
                    <Button className="w-full lg:w-auto bg-[#319b5d] hover:bg-[#28844f] text-white font-semibold gap-2 h-11 shrink-0">
                      <Plus className="h-4 w-4" />
                      เพิ่มพรรณไม้
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm overflow-hidden">
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
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border bg-muted/50">
                            <TableHead className="pl-6 font-bold text-foreground">ชื่อพรรณไม้</TableHead>
                            <TableHead className="font-bold text-foreground">ชื่อวิทยาศาสตร์</TableHead>
                            <TableHead className="text-center font-bold text-foreground">หมวดหมู่</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-foreground">จัดการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPlants.map((plant) => (
                            <TableRow key={plant.id} className="border-border">
                              <TableCell className="pl-6 font-medium">
                                {plant.name}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <ScientificName name={plant.scientificName} />
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="font-normal w-[68px] justify-center mx-auto">
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
                                          onClick={() => {
                                            removePlant(plant.id);
                                            toast.success(`ลบ ${plant.name} แล้ว`, {
                                              position: "bottom-right",
                                              style: {
                                                background: "#FAE251",
                                                color: "#000",
                                                borderColor: "#F0D642",
                                              },
                                            });
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
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "statistics" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard label="ผู้ใช้วันนี้" value={stats.usersToday} hint="กำลังใช้งาน" icon={Users} tone="primary" trend={{ value: 5, positive: true }} />
                <StatCard label="ผู้ใช้ทั้งหมด" value={stats.totalUsers} hint="ลงทะเบียนแล้ว" icon={Users} tone="info" trend={{ value: 18, positive: true }} />
              </div>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    สรุปสถิติรายละเอียด
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "การจำแนกวันนี้", value: stats.todayClassifications, icon: Calendar },
                      { label: "การจำแนกทั้งหมด", value: stats.totalClassifications.toLocaleString(), icon: Target },
                      { label: "จำนวนพรรณไม้", value: plants.length, icon: Leaf },
                    ].map((row) => {
                      const Icon = row.icon;
                      return (
                        <div
                          key={row.label}
                          className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {row.label}
                            </span>
                          </div>
                          <span className="font-display text-xl font-bold tabular-nums">
                            {row.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "settings" && (
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg">ตั้งค่าระบบ</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                ส่วนนี้สามารถเชื่อมต่อกับ Lovable Cloud เพื่อจัดการสิทธิ์ผู้ใช้และการตั้งค่าได้ในอนาคต
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <MobileTabBar active={activeTab} onChange={setActiveTab} />
      <EditPlantModal 
        plant={editingPlant}
        isOpen={!!editingPlant}
        onClose={() => setEditingPlant(null)}
        onSave={(updatedPlant) => {
          if (updatePlant) {
            updatePlant(updatedPlant);
            toast.success("อัปเดตข้อมูลพรรณไม้สำเร็จ", {
              position: "bottom-right",
              style: {
                background: "#FAE251",
                color: "#000",
                borderColor: "#F0D642",
              },
            });
          }
        }}
      />
    </div>
  );
};

export default Admin;
