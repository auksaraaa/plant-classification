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
    <div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#00513b' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating leaves */}
        {leaves.map((leaf) => (
          <FloatingLeaf key={leaf.id} id={leaf.id} delay={leaf.delay} />
        ))}

        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md bg-white shadow-2xl relative z-10 border-0">
        <CardHeader className="space-y-3 text-center pb-6 pt-8">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl" style={{ backgroundColor: '#00513b' }} >
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold" style={{ color: '#00513b' }}>PlantAdmin</CardTitle>
            <CardDescription className="text-base mt-2" style={{ color: '#157347' }}>
              ระบบจัดการพรรณไม้
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#00513b' }}>
                อีเมล
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@plant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || loading}
                className="h-11 border-2 focus:ring-2 bg-white"
                style={{ 
                  borderColor: '#d1d5db',
                  '--tw-ring-color': 'rgba(0, 81, 59, 0.1)'
                } as React.CSSProperties}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#00513b' }}>
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
                  className="h-11 border-2 focus:ring-2 bg-white pr-10"
                  style={{ 
                    borderColor: '#d1d5db',
                    '--tw-ring-color': 'rgba(0, 81, 59, 0.1)'
                  } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#00513b' }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full text-white font-semibold h-11 mt-7 text-base"
              style={{ backgroundColor: '#00513b' }}
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

          <div className="mt-8 p-4 rounded-xl border-2" style={{ backgroundColor: '#f0f7f3', borderColor: '#c8e6d9' }}>
            <p className="text-xs text-center" style={{ color: '#00513b' }}>
              💡 <strong>Demo Account:</strong>
              <br className="mt-1" />
              <span className="text-xs">Email: admin@plant.com</span>
              <br />
              <span className="text-xs">Password: admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
