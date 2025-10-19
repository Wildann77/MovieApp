# Photo Upload Integration for Master Data Management

## 🎯 **Fitur Photo Upload yang Ditambahkan**

### 1. **PhotoUpload Component**
Komponen baru yang menggabungkan upload functionality dengan preview yang user-friendly:

```jsx
<PhotoUpload
  label="Actor Photo"
  value={photoUrl}
  onChange={handlePhotoUpload}
  endpoint="actorPhoto"
  error={errors.photo}
  placeholder="Upload actor photo"
  maxSize="4MB"
  previewSize="h-20 w-20"
  disabled={isLoading}
/>
```

### 2. **UploadThing Endpoints**
UploadThing endpoints yang tersedia untuk master data:

```javascript
// backend/src/lib/uploadthing.js
actorPhoto: f({
  image: {
    maxFileSize: "4MB",
    maxFileCount: 1,
  },
}),
directorPhoto: f({
  image: {
    maxFileSize: "4MB", 
    maxFileCount: 1,
  },
})
```

### 3. **Master Data Integration**
MasterDataManagement sekarang menggunakan PhotoUpload component untuk:
- ✅ Actor photos (`actorPhoto` endpoint)
- ✅ Director photos (`directorPhoto` endpoint)  
- ❌ Writer (no photo needed)
- ❌ Genre (no photo needed)

## 🔧 **Cara Kerja PhotoUpload Component**

### **Features:**
- **Drag & Drop Upload**: User dapat drag file langsung ke area upload
- **Preview**: Preview foto yang sudah diupload dengan avatar styling
- **Remove Function**: Tombol untuk menghapus foto yang sudah diupload
- **Error Handling**: Menampilkan error messages dengan styling yang konsisten
- **Loading States**: Disabled state saat sedang loading
- **Responsive**: Layout yang responsive untuk mobile dan desktop

### **Props:**
```typescript
interface PhotoUploadProps {
  label?: string;              // Label untuk form field
  error?: string;              // Error message
  required?: boolean;          // Required field indicator
  value?: string;              // Current photo URL
  onChange?: (url: string) => void; // Callback saat foto berubah
  endpoint?: string;           // UploadThing endpoint
  className?: string;          // Custom CSS classes
  containerClassName?: string; // Container CSS classes
  previewSize?: string;        // Size untuk preview (default: "h-20 w-20")
  showPreview?: boolean;       // Show preview atau tidak
  accept?: string;             // File types yang diterima
  maxSize?: string;            // Maximum file size
  placeholder?: string;        // Placeholder text
  disabled?: boolean;          // Disabled state
}
```

## 🎨 **UI/UX Improvements**

### **Visual Design:**
- **Avatar Preview**: Menggunakan Avatar component untuk preview yang konsisten
- **Hover Effects**: Smooth transitions dan hover effects
- **Error States**: Clear error messaging dengan warning icons
- **Loading States**: Visual feedback saat upload sedang berlangsung

### **User Experience:**
- **Toast Notifications**: Success/error messages menggunakan sonner
- **File Validation**: Client-side validation untuk file size dan type
- **Responsive Layout**: Works well pada semua screen sizes
- **Accessibility**: Proper ARIA labels dan keyboard navigation

## 🔄 **Integration dengan Master Data**

### **MasterDataManagement Updates:**
```jsx
// Photo upload section di form
{hasPhoto && (
  <PhotoUpload
    label={`${entityName} Photo`}
    value={photoUrl}
    onChange={handlePhotoUpload}
    endpoint={photoEndpoint}
    error={errors.photo}
    placeholder={`Upload ${entityName.toLowerCase()} photo`}
    maxSize="4MB"
    previewSize="h-20 w-20"
    disabled={isLoading}
  />
)}
```

### **MasterDataWrapper Configuration:**
```javascript
const entityConfigs = {
  actor: {
    // ...
    hasPhoto: true,
    photoEndpoint: 'actorPhoto',
  },
  director: {
    // ...
    hasPhoto: true,
    photoEndpoint: 'directorPhoto',
  },
  writer: {
    // ...
    hasPhoto: false,
    photoEndpoint: null,
  },
  genre: {
    // ...
    hasPhoto: false,
    photoEndpoint: null,
  }
};
```

## 🚀 **Available Endpoints**

### **UploadThing Endpoints:**
1. **`actorPhoto`** - Upload actor photos (4MB max)
2. **`directorPhoto`** - Upload director photos (4MB max)
3. **`userAvatar`** - Upload user avatars (2MB max)
4. **`moviePoster`** - Upload movie posters (4MB max)
5. **`movieHeroImage`** - Upload movie hero images (6MB max)
6. **`movieGallery`** - Upload movie gallery images (4MB max, 5 files)
7. **`trailerThumbnail`** - Upload trailer thumbnails (4MB max)

## 📱 **Responsive Design**

### **Mobile (< 640px):**
- Compact preview size
- Full-width upload button
- Stacked layout

### **Tablet (640px - 1024px):**
- Medium preview size
- Side-by-side layout
- Touch-friendly buttons

### **Desktop (> 1024px):**
- Larger preview size
- Hover effects
- Detailed file information

## 🔒 **Security & Validation**

### **Client-side Validation:**
- File type checking (images only)
- File size validation
- Required field validation

### **Server-side Security:**
- UploadThing handles file validation
- Secure file storage
- Automatic file optimization

## 🎯 **Next Steps**

1. **Test Upload Functionality**: Verify semua endpoints bekerja dengan benar
2. **Error Handling**: Test berbagai error scenarios
3. **Performance**: Monitor upload performance dan optimize jika perlu
4. **User Feedback**: Collect feedback untuk UI/UX improvements

## 📋 **Usage Examples**

### **Admin Dashboard:**
```jsx
<MasterDataWrapper
  mode="admin"
  entityType="actor"
  hooks={useAdminActors}
/>
```

### **User Dashboard:**
```jsx
<MasterDataWrapper
  mode="dashboard"
  entityType="director"
  hooks={{
    useGet: useDirectors,
    useCreate: useCreateDirector,
    useUpdate: useUpdateDirector,
    useDelete: useDeleteDirector
  }}
/>
```

Photo upload akan otomatis tersedia untuk semua entity yang memiliki `hasPhoto: true` di konfigurasi! 🎉
