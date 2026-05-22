# Firebase Setup Guide for Admin Login

## Step 1: Deploy Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `plantify-52c88`
3. Navigate to **Firestore Database** > **Rules** tab
4. Replace the existing rules with the content from `firestore.rules` file:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow public read access to plants
    match /plants/{document=**} {
      allow read: if true;
    }

    // Allow authenticated users to read their own admin status
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
    }

    // Prevent public writes
    match /{document=**} {
      allow write: if false;
    }
  }
}
```

5. Click **Publish**

## Step 2: Enable Firebase Authentication

1. Go to **Authentication** tab
2. Click **Get Started**
3. Click **Email/Password** provider
4. Toggle **Enable** on
5. Click **Save**

## Step 3: Create Admin User

### Option A: Via Firebase Console

1. Go to **Authentication** > **Users** tab
2. Click **Add user**
3. Enter email and password:
   - Email: `admin@plant.com`
   - Password: `admin123`
4. Click **Add user**
5. Copy the **UID** that was generated

### Option B: Using Admin SDK

Run this in Firebase Cloud Functions or locally:

```javascript
const admin = require('firebase-admin');

async function createAdmin() {
  const userRecord = await admin.auth().createUser({
    email: 'admin@plant.com',
    password: 'admin123'
  });

  const uid = userRecord.uid;

  // Add to admins collection
  await admin.firestore().collection('admins').doc(uid).set({
    isAdmin: true,
    email: 'admin@plant.com',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('Admin user created with UID:', uid);
}

createAdmin();
```

## Step 4: Create the Admin Document in Firestore

1. Go to **Firestore Database** > **Data** tab
2. Click **+ Create collection**
3. Enter collection name: `admins`
4. Click **Next**
5. Document ID: (paste the **UID** from Step 3)
6. Add fields:
   - Field name: `isAdmin` | Type: `boolean` | Value: `true`
   - Field name: `email` | Type: `string` | Value: `admin@plant.com`
7. Click **Save**

## Step 5: Test Login

1. Navigate to `http://localhost:5173/admin-login`
2. Enter credentials:
   - Email: `admin@plant.com`
   - Password: `admin123`
3. Click **เข้าสู่ระบบ** (Login)

## Troubleshooting

### Issue: Still getting permission errors

- Verify Firestore rules are published
- Check that the `admins` collection exists
- Ensure the document ID matches the user's UID exactly
- Make sure Firebase Authentication is enabled

### Issue: Can't see the login page

- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check console for errors

### Issue: Login button doesn't work

- Check email and password are correct
- Verify user exists in Firebase Authentication
- Check browser console for error messages

## Security Recommendations

⚠️ For production, implement:

1. **Strong password requirements** - Enforce minimum length and complexity
2. **Two-Factor Authentication** - Enable in Firebase Console
3. **Limit admin accounts** - Only create necessary accounts
4. **Audit logging** - Log all admin actions
5. **Session timeout** - Implement auto-logout after inactivity
6. **IP whitelisting** - Restrict admin access to specific IPs
