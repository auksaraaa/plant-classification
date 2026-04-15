# LINE Mini App Integration Guide

## ภาพรวม
เอกสารนี้อธิบายวิธีการเชื่อมต่อแอปพลิเคชันของคุณกับ LINE Mini App และการตั้งค่า LINE Login OAuth.

## ขั้นตอนการตั้งค่า

### 1. สร้าง LINE Developer Account
1. ไปที่ [LINE Developers](https://developers.line.biz)
2. เข้าสู่ระบบด้วยบัญชี LINE ของคุณ
3. สร้าง Provider ใหม่

### 2. สร้าง Channel สำหรับ Mini App
1. ใน LINE Developers Console ของคุณ
2. คลิก "Create a new channel"
3. เลือก **Line Mini App** เป็น Channel type
4. กรอกข้อมูล:
   - **Channel Name**: ชื่อแอปของคุณ (เช่น "Plant Classification")
   - **Channel Description**: คำอธิบายแอป
   - **Category**: เลือก "Lifestyle" หรือหมวดหมู่ที่เหมาะสม

### 3. ค้นหา Channel ID และ Secret
1. ไปที่ **Settings** ของ Channel ที่สร้างใหม่
2. จดบันทึก **Channel ID** และ **Channel Secret**

### 4. สร้าง LIFF App
1. ใน Channel ของคุณ ไปที่ **LIFF** tab
2. คลิก "Create" เพื่อสร้าง LIFF app ใหม่
3. กรอกข้อมูล:
   - **LIFF Name**: ชื่อ LIFF app (เช่น "Plant App Login")
   - **URL**: URL ของแอปของคุณ
     - **Development**: `http://localhost:5173`
     - **Production**: `https://yourdomain.com`
4. เลือก **Permissions** ที่ต้องการ:
   - ✅ `profile` - เพื่อดึงข้อมูล profile ของผู้ใช้
   - ✅ `openid` - สำหรับการยืนยันตัวตน
5. คลิก "Create" และจดบันทึก **LIFF ID**

### 5. ตั้งค่า Environment Variables
1. สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```env
VITE_LINE_LIFF_ID=YOUR_LIFF_ID_HERE
VITE_LINE_CHANNEL_ID=YOUR_CHANNEL_ID_HERE
VITE_LINE_CHANNEL_SECRET=YOUR_CHANNEL_SECRET_HERE
```

2. แทนที่ค่า YOUR_XXX_HERE ด้วยค่าจากขั้นตอนที่ 3 และ 4

### 6. เรียกใช้แอป
```bash
npm run dev
```

แอปของคุณจะทำงานที่ `http://localhost:5173`

## การทดสอบ

### ทดสอบใน LINE Mini App
1. ใน LINE Developers Console ik Edit the LIFF app
2. คลิก "Check on Simulator" เพื่อทดสอบใน LINE Simulator
3. หรือ ใช้ QR Code ที่จะแสดงขึ้นเพื่อเปิดในแอป LINE จริง

### ทดสอบ LINE Login
1. คลิกปุ่ม "เข้าสู่ระบบด้วย LINE"
2. ผู้ใช้จะถูกนำไปยัง LINE login page
3. หลังจากเข้าสู่ระบบสำเร็จ ข้อมูล profile จะแสดง

## File Structure

```
src/
├── config/
│   └── line-config.ts          # LINE configuration
├── hooks/
│   └── use-line-auth.ts        # LINE authentication hook
└── pages/
    └── Login.tsx               # Updated login page
```

## Features ที่สนับสนุน

- ✅ LINE Login with OAuth
- ✅ ดึง User Profile (ID, Name, Picture)
- ✅ Mini App Environment Detection
- ✅ Logout functionality
- ✅ Loading states และ Error handling

## Advanced: Backend Integration (Optional)

หากคุณต้อง backend authentication:

1. ใช้ Access Token จาก LIFF:
```typescript
const accessToken = await liff.getAccessToken();
// ส่ง accessToken ไป backend เพื่อ verification
```

2. Backend verify token:
```
GET https://api.line.me/v2/oauth/verify?access_token=TOKEN
```

3. Backend retrieve user info:
```
GET https://api.line.me/v2/profile
Authorization: Bearer TOKEN
```

## Troubleshooting

### Problem: "LIFF initialization error"
**Solution**: ตรวจสอบว่า VITE_LINE_LIFF_ID ถูกตั้งค่าอย่างถูกต้อง

### Problem: "Cannot read property 'login' of undefined"
**Solution**: ใหม่ page load เพราะ LIFF SDK ยังไม่โหลดเสร็จ

### Problem: "Redirect URI mismatch"
**Solution**: ตรวจสอบว่า URL ใน LIFF settings ตรงกับ URL ของแอปปัจจุบัน

## References

- [LINE Developers Documentation](https://developers.line.biz/en/docs/)
- [LIFF API Reference](https://developers.line.biz/en/reference/liff/)
- [LINE Mini App](https://developers.line.biz/en/docs/mini-app/)
