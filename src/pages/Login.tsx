import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, MessageCircle, Loader } from "lucide-react";
import { toast } from "sonner";
import { useLineAuth } from "@/hooks/use-line-auth";
import { lineConfig, validateLineConfig } from "@/config/line-config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, isLoggedIn, profile, login: lineLogin } = useLineAuth(lineConfig.liffId);

  // Redirect to profile if already logged in
  useEffect(() => {
    if (isLoggedIn && profile) {
      navigate("/profile");
    }
  }, [isLoggedIn, profile, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    toast.success("เข้าสู่ระบบสำเร็จ! (ตัวอย่าง)");
  };

  const handleLineLogin = async () => {
    if (!validateLineConfig()) {
      toast.error("ยังไม่ได้ตั้งค่า LINE Config");
      return;
    }

    try {
      await lineLogin();
    } catch (error) {
      toast.error("ไม่สามารถเข้าสู่ระบบด้วย LINE ได้");
    }
  };

  return (
    <div className="container max-w-full sm:max-w-md px-3 sm:px-4 py-8 sm:py-12 animate-fade-in">
      <h1 className="text-2xl sm:text-2xl font-bold text-foreground text-center mb-2">เข้าสู่ระบบ</h1>
      <p className="text-center text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">เข้าสู่ระบบเพื่อบันทึกรายการโปรดของคุณ</p>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">อีเมล</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border bg-background text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border bg-background text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 sm:py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm sm:text-base hover:opacity-90 transition-opacity"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4 sm:my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs sm:text-sm text-muted-foreground">หรือ</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* LINE Login */}
      <button 
        onClick={handleLineLogin}
        disabled={isLoading}
        className="w-full py-2.5 sm:py-3 rounded-lg bg-line text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            กำลังเข้าสู่ระบบ...
          </>
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            เข้าสู่ระบบด้วย LINE
          </>
        )}
      </button>
      <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3">
        {isLoggedIn && profile
          ? `เข้าสู่ระบบแล้ว: ${profile.displayName}`
          : "เข้าสู่ระบบด้วยบัญชี LINE ของคุณ เพื่อความสะดวกและรวดเร็ว"}
      </p>
    </div>
  );
};

export default Login;
