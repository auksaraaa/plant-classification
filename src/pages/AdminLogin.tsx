import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/use-admin-auth";

// Floating Leaf Component
const FloatingLeaf = ({ id, delay }: { id: number; delay: number }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        animation: `float ${6 + Math.random() * 4}s linear infinite`,
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
        top: `${-20 - Math.random() * 50}px`,
      }}
    >
      <Leaf className="h-6 w-6 text-green-500/30 rotate-45" />
    </div>
  );
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaves, setLeaves] = useState<Array<{ id: number; delay: number }>>([]);

  // Generate floating leaves on mount
  useEffect(() => {
    const generatedLeaves = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
    }));
    setLeaves(generatedLeaves);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/admin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "เข้าสู่ระบบล้มเหลว"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating leaves */}
        {leaves.map((leaf) => (
          <FloatingLeaf key={leaf.id} id={leaf.id} delay={leaf.delay} />
        ))}

        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Leaf className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">PlantAdmin</CardTitle>
          <CardDescription className="text-slate-600">
            ระบบจัดการพรรณไม้
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                อีเมล
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || loading}
                className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                รหัสผ่าน
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting || loading}
                  className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold h-11 mt-6"
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs text-slate-700 text-center">
              💡 <strong>Demo Account:</strong>
              <br />
              Email: admin@plant.com
              <br />
              Password: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
