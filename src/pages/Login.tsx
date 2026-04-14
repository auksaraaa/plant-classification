import { useState } from "react";
import { Mail, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("เข้าสู่ระบบสำเร็จ! (ตัวอย่าง)");
  };

  return (
    <div className="container py-12 max-w-md animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground text-center mb-2">เข้าสู่ระบบ</h1>
      <p className="text-center text-muted-foreground mb-8">เข้าสู่ระบบเพื่อบันทึกรายการโปรดของคุณ</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">อีเมล</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">หรือ</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* LINE Login */}
      <button className="w-full py-3 rounded-lg bg-line text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
        <MessageCircle className="h-5 w-5" />
        เข้าสู่ระบบด้วย LINE
      </button>
      <p className="text-xs text-muted-foreground text-center mt-3">
        เข้าสู่ระบบด้วยบัญชี LINE ของคุณ เพื่อความสะดวกและรวดเร็ว
      </p>
    </div>
  );
};

export default Login;
