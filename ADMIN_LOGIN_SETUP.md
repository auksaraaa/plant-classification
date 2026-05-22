# Admin Login Setup Guide

## Overview

The admin login system uses Firebase Authentication to securely manage admin credentials. Only users with the `admin` role in Firestore can access the admin dashboard.

## Features

✅ **Firebase Authentication** - Secure email/password authentication managed by Firebase
✅ **Admin Role Verification** - Only authorized admins can access the dashboard
✅ **Session Persistence** - Admin login state is maintained across page refreshes
✅ **Logout Functionality** - Easy logout with a button in the admin header
✅ **Thai Language Support** - All UI text in Thai
✅ **No Password Storage** - Passwords handled securely by Firebase, not stored in Firestore

## Setup Instructions

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `plantify-52c88`
3. Navigate to **Authentication** > **Sign-in methods**
4. Enable **Email/Password** authentication

### 2. Create Admin Users

#### Method A: Using Firebase Console (Recommended for initial setup)

1. Go to **Authentication** tab
2. Click **Add user** button
3. Enter email and password for the admin
4. Click **Add user**
5. Copy the **User UID** (you'll need this for Firestore)
6. Go to **Firestore Database**
7. Create/Update the `users` collection
8. Create a document with **Document ID** = user's email
9. Add the following fields:
   ```
   email: "admin@example.com" (string)
   role: "admin" (string)
   createdAt: (current date/timestamp)
   ```

#### Method B: Using Firebase Admin SDK (For production automation)

```typescript
import admin from 'firebase-admin';

async function createAdminUser(email: string, password: string) {
  try {
    // Create auth user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Add to Firestore users collection
    await admin.firestore().collection('users').doc(email).set({
      email: email,
      role: 'admin',
    });

    console.log('Admin user created:', userRecord.uid);
    return userRecord.uid;
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// Usage
createAdminUser('admin@plant.com', 'admin123');
```

### 3. Firestore Structure

The `users` collection should have documents with this structure:

```
users/
  admin@example.com:  {
    email: "admin@example.com",
    role: "admin"
  }
```

**Important**: 
- Use the email address as the document ID for easy lookup
- Only `email` and `role: "admin"` are required
- `createdAt` and other fields are optional

### 4. Demo Account

A demo account is shown in the login form:
- **Email**: `admin@plant.com`
- **Password**: `admin123`

To create this account:

1. In Firebase Console > Authentication, add user:
   - Email: `admin@plant.com`
   - Password: `admin123`
   
2. Then in Firestore, create document at `users/admin@plant.com`:
   ```json
   {
     "email": "admin@plant.com",
     "role": "admin"
   }
   ```

## How to Use

### Accessing Admin Panel

1. Navigate to `http://localhost:5173/admin-login`
2. Enter your admin email and password
3. Click "เข้าสู่ระบบ" (Login)

### Authentication Flow

1. User enters email and password on login page
2. Firebase Authentication validates credentials
3. System checks if user has `role: "admin"` in Firestore `users` collection
4. **If admin role**: ✅ Login successful → Redirect to admin dashboard
5. **If no admin role**: ❌ Login rejected → Error message displayed

### Admin Dashboard

Once logged in, you can:

- **Dashboard**: View key statistics
- **จัดการพรรณไม้ (Manage Plants)**: Add, edit, and delete plants
- **สถิติการใช้งาน (Statistics)**: View usage analytics

## Security Notes

- ✅ Passwords are securely managed by Firebase Authentication
- ✅ No password hashes are stored in Firestore
- ✅ Admin role is the only required check
- ✅ Firebase handles password encryption and secure storage

## Troubleshooting

### "อีเมลไม่พบในระบบ" (Email not found)
- Ensure the user was created in Firebase Authentication
- Check that the email spelling is correct

### "คุณไม่มีสิทธิ์เข้าใช้งานส่วนแอดมิน" (No admin permission)
- Go to Firestore `users` collection
- Create/update the document with `role: "admin"`
- Use the email address as the document ID

### "รหัสผ่านไม่ถูกต้อง" (Incorrect password)
- Check that password is typed correctly
- Reset password in Firebase Console if forgotten
- **ตั้งค่าระบบ (Settings)**: Configure system settings

### Logging Out

Click the logout button (arrow icon) in the top-right corner of the admin header.

## File Structure

```
src/
├── pages/
│   ├── AdminLogin.tsx          # Login page component
│   └── Admin.tsx               # Admin dashboard (updated with auth)
├── hooks/
│   └── use-admin-auth.ts       # Authentication hook
└── config/
    └── firebase.ts             # Firebase configuration
```

## Security Considerations

⚠️ **Important**: This is a basic implementation. For production:

1. **Use Strong Passwords**: Implement password requirements
2. **Enable 2FA**: Set up two-factor authentication in Firebase
3. **Use HTTPS**: Ensure your site uses HTTPS only
4. **Limit Admin Accounts**: Only create necessary admin accounts
5. **Audit Logs**: Implement logging for admin actions
6. **Rate Limiting**: Add rate limiting to the login endpoint
7. **Environment Variables**: Keep Firebase config secure

## Troubleshooting

### Issue: "ไม่มีสิทธิ์ในการเข้าถึงแอดมิน" (No admin permission)

**Solution**: 
- Verify the user exists in the `admins` collection in Firestore
- Check that `isAdmin` field is set to `true`
- Ensure the document ID matches the user's Firebase UID

### Issue: Login page appears but credentials don't work

**Solution**:
- Verify Firebase Authentication is enabled
- Check that the user is created in Firebase Authentication
- Ensure the `admins` collection entry exists

### Issue: Page redirects to login after successful login

**Solution**:
- Check browser console for errors
- Verify Firestore rules allow reading from `admins` collection
- Ensure Firebase is properly initialized

## Firebase Security Rules

Add these rules to your Firestore for the admins collection:

```
match /admins/{document=**} {
  allow read: if request.auth != null && request.auth.uid == resource.id;
  allow write: if false; // Only allow via backend/admin SDK
}
```

## Firestore Rules for Admin Dashboard

```
match /plants/{document=**} {
  allow read: if true;
  allow create, update, delete: if request.auth != null && 
    exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

## Next Steps

1. Create admin accounts using the methods above
2. Test login with the demo account
3. Implement additional admin features as needed
4. Set up audit logging for security
5. Consider implementing session timeouts for security

## Support

For issues with Firebase Authentication, refer to:
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)

## API Reference

### useAdminAuth Hook

```typescript
const {
  user,              // Current admin user object
  loading,           // Loading state
  error,             // Error message if any
  isAuthenticated,   // Boolean: is user authenticated admin
  login,             // Function: login(email, password)
  logout             // Function: logout()
} = useAdminAuth();
```
