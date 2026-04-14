import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t bg-secondary/50 mt-16">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="mb-3">
            <Logo size="sm" showText={true} />
          </div>
          <p className="text-sm text-muted-foreground">
            แหล่งรวมข้อมูลพรรณไม้ สำหรับผู้รักต้นไม้ทุกคน
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">ลิงก์</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
            <Link to="/how-to-use" className="hover:text-primary transition-colors">วิธีใช้งาน</Link>
            <Link to="/about" className="hover:text-primary transition-colors">เกี่ยวกับเรา</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">ติดต่อเรา</h4>
          <p className="text-sm text-muted-foreground">อีเมล: info@planthai.com</p>
          <p className="text-sm text-muted-foreground">โทร: 02-xxx-xxxx</p>
        </div>
      </div>
      <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
        © 2026 พรรณไม้ไทย. สงวนลิขสิทธิ์ทุกประการ
      </div>
    </div>
  </footer>
);

export default Footer;
