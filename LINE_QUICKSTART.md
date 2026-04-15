# LINE Mini App Integration - Quick Start

## 🎉 การตั้งค่าเสร็จสิ้น

ใหม่ได้ตั้งค่า LINE Mini App integration ให้กับแอปของคุณแล้ว! ต่อไปนี้คือสรุปการเปลี่ยนแปลง:

## 📦 Packages ที่ติดตั้ง

- `@line/liff` - LINE Front-end Framework

## 📁 Files ที่สร้างข้อใหม่

### Configuration
- `src/config/line-config.ts` - ตั้งค่า LINE
- `.env.example` - ตัวอย่าง environment variables

### Hooks
- `src/hooks/use-line-auth.ts` - Custom hook สำหรับ LINE authentication

### Contexts
- `src/contexts/LineContext.tsx` - React Context สำหรับ LINE state management

### Components
- `src/components/LineProfileDisplay.tsx` - Component สำหรับแสดง LINE profile

### Utilities
- `src/lib/line-utils.ts` - Helper functions สำหรับ LINE operations

### Documentation
- `LINE_SETUP_GUIDE.md` - คู่มือการตั้งค่า LINE Mini App อย่างละเอียด

## 📝 Files ที่แก้ไข

- `index.html` - เพิ่ม LINE LIFF SDK script
- `src/pages/Login.tsx` - อัปเดต LOGIN component ให้ใช้ LINE authentication จริง

## 🚀 ขั้นตอนถัดไป

### Step 1: ตั้งค่า LINE Developer Account
อ่าน [`LINE_SETUP_GUIDE.md`](LINE_SETUP_GUIDE.md) เพื่อได้คำแนะนำทีละขั้นตอน

### Step 2: ตั้งค่า Environment Variables
1. สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:
```env
VITE_LINE_LIFF_ID=YOUR_LIFF_ID
VITE_LINE_CHANNEL_ID=YOUR_CHANNEL_ID
VITE_LINE_CHANNEL_SECRET=YOUR_CHANNEL_SECRET
```

### Step 3: ทดสอบแอป
```bash
npm run dev
```

### Step 4: ทดสอบ LINE Login
1. ไปที่หน้า `/login`
2. คลิกปุ่ม "เข้าสู่ระบบด้วย LINE"
3. ตรวจสอบว่า profile ข้อมูลแสดงขึ้น

## 🔧 การใช้ LINE Features ในแอป

### ใช้ LINE Authentication Hook
```typescript
import { useLineAuth } from '@/hooks/use-line-auth';
import { lineConfig } from '@/config/line-config';

const MyComponent = () => {
  const { isLoggedIn, profile, login, logout } = useLineAuth(lineConfig.liffId);
  
  return (
    <div>
      {isLoggedIn && <p>Hello {profile?.displayName}</p>}
      <button onClick={login}>Login with LINE</button>
    </div>
  );
};
```

### ใช้ LINE Context (แนะนำ)
```typescript
import { useLineContext } from '@/contexts/LineContext';

const MyComponent = () => {
  const { isLoggedIn, profile, logout } = useLineContext();
  
  return <div>{/* Your component */}</div>;
};
```

### ใช้ LINE Utilities
```typescript
import { 
  isInMiniApp, 
  shareToLine, 
  closeLiffApp,
  getDeviceInfo 
} from '@/lib/line-utils';

// ตรวจสอบว่าทำงานใน Mini App
if (isInMiniApp()) {
  console.log('Running in LINE Mini App');
}

// Share ไปยัง LINE chat
await shareToLine('Check out this plant!');

// ปิด Mini App
closeLiffApp();
```

## 📚 Features ที่พร้อมใช้

- ✅ LINE Login with OAuth
- ✅ ดึง User Profile (ID, Name, Picture, Status)
- ✅ ตรวจสอบ Mini App Environment
- ✅ Share ไปยัง LINE
- ✅ Send Messages
- ✅ Close Mini App
- ✅ Get Device Info
- ✅ Error Handling & Loading States

## 🐛 Troubleshooting

หากพบปัญหา ดู [`LINE_SETUP_GUIDE.md`](LINE_SETUP_GUIDE.md) ส่วน Troubleshooting

## 📖 เอกสารเพิ่มเติม

- [LINE Developers](https://developers.line.biz)
- [LIFF Reference](https://developers.line.biz/en/reference/liff/)
- [LINE Mini App Docs](https://developers.line.biz/en/docs/mini-app/)

---

Happy coding! 🎉
