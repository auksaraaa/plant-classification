# Firebase Setup Guide

## Configuration
Firebase is configured in `src/config/firebase.ts`. The configuration uses your Firebase project credentials (projectId: plantify-52c88).

## Available Firestore Functions

### Collections
- `plants` - Store plant information
- `userProfiles` - Store user profile data

### Basic CRUD Operations

```typescript
// Import functions
import { 
  setDocument, 
  getDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument 
} from '@/lib/firestore';

// Set a document
await setDocument('plants', 'plant-id', { name: 'Rose', category: 'Flower' });

// Get a document
const plant = await getDocument('plants', 'plant-id');

// Get all documents
const allPlants = await getDocuments('plants');

// Update a document
await updateDocument('plants', 'plant-id', { category: 'Flowering' });

// Delete a document
await deleteDocument('plants', 'plant-id');
```

### Plant-Specific Functions

```typescript
import { 
  addPlant, 
  getPlant, 
  getAllPlants, 
  updatePlant, 
  deletePlant 
} from '@/lib/firestore';

// Add a plant
const result = await addPlant({
  name: 'Sunflower',
  category: 'Flower',
  description: 'A bright yellow flower'
});

// Get plant
const plant = await getPlant('plant-id');

// Get all plants
const plants = await getAllPlants();

// Update plant
await updatePlant('plant-id', { category: 'Updated Category' });

// Delete plant
await deletePlant('plant-id');
```

### User Profile Functions

```typescript
import { 
  setUserProfile, 
  getUserProfile, 
  updateUserProfile 
} from '@/lib/firestore';

// Set user profile
await setUserProfile('user-id', {
  displayName: 'John Doe',
  email: 'john@example.com'
});

// Get user profile
const profile = await getUserProfile('user-id');

// Update user profile
await updateUserProfile('user-id', {
  displayName: 'Jane Doe'
});
```

## Available Cloud Storage Functions

### Image Upload/Download

```typescript
import { 
  uploadImage,
  uploadMultipleImages,
  getImageURL,
  deleteImage,
  uploadPlantImage,
  uploadProfileImage,
  deletePlantImage
} from '@/lib/storage';

// Upload a single image
const imageUrl = await uploadImage(file, 'path/in/storage');

// Upload multiple images
const urls = await uploadMultipleImages(files, 'path/in/storage');

// Get image URL
const url = await getImageURL('path/to/image');

// Delete image
await deleteImage('path/to/image');

// Upload plant image
const plantImageUrl = await uploadPlantImage(file, 'plant-id');

// Upload profile image
const profileImageUrl = await uploadProfileImage(file, 'user-id');

// Delete plant image
await deletePlantImage('plant-id', 'image-path');
```

## Examples

### Adding a plant with image
```typescript
import { addPlant } from '@/lib/firestore';
import { uploadPlantImage } from '@/lib/storage';

async function createPlantWithImage(plantData, imageFile) {
  try {
    // Add plant to Firestore
    const result = await addPlant({
      name: plantData.name,
      category: plantData.category,
      description: plantData.description
    });

    // Upload plant image
    const imageUrl = await uploadPlantImage(imageFile, result.id);

    // Update plant with image URL
    await updateDocument('plants', result.id, {
      imageUrl: imageUrl
    });

    return result;
  } catch (error) {
    console.error('Error creating plant:', error);
  }
}
```

### Fetching plants with images
```typescript
import { getAllPlants } from '@/lib/firestore';

async function getPlantsWithImages() {
  try {
    const plants = await getAllPlants();
    return plants; // Each plant has imageUrl field
  } catch (error) {
    console.error('Error fetching plants:', error);
  }
}
```

## Database Schema

### Plants Collection
```
{
  id: string (auto-generated),
  name: string,
  category: string,
  description: string,
  imageUrl: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### User Profiles Collection
```
{
  id: string (user-id),
  displayName: string,
  email: string,
  profileImageUrl: string (optional),
  createdAt: timestamp (optional),
  updatedAt: timestamp
}
```

## Cloud Storage Structure
```
storage-root/
  ├── plants/{plantId}/{filename}
  └── users/{userId}/{filename}
```

## Important Notes
- All timestamps are automatically added/updated
- Firebase configuration is loaded from `src/config/firebase.ts`
- Make sure to handle errors appropriately in your components
- For LINE Login integration, store the user ID from LINE LIFF in Firestore
