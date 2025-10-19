# Fitur Report Review

Fitur report review telah berhasil diimplementasikan untuk memungkinkan user melaporkan review yang tidak pantas atau melanggar aturan.

## Fitur yang Diimplementasikan

### 1. Backend Changes

#### Model Review (`backend/src/models/review.model.js`)
- Ditambahkan field `reportedBy` array untuk menyimpan data reporter
- Setiap report menyimpan: user ID, alasan report, dan timestamp

#### API Endpoints
- **POST** `/api/reviews/:reviewId/report` - Endpoint untuk melaporkan review
- **GET** `/api/admin/reviews` - Admin endpoint untuk melihat semua review termasuk yang di-report

#### Service Functions
- `reportReview()` - Fungsi untuk memproses report review
- Validasi: user tidak bisa report review sendiri
- Validasi: user tidak bisa report review yang sama dua kali
- Auto-set `isReported = true` ketika ada report pertama

### 2. Frontend Changes

#### Hook (`frontend/src/hooks/use-report-review.js`)
- Custom hook untuk handle report review mutation
- Auto-refresh data setelah report berhasil
- Toast notification untuk feedback user

#### Review Section (`frontend/src/components/movies/detail/ReviewSection.jsx`)
- Ditambahkan report button (flag icon) pada setiap review
- Modal dialog untuk input alasan report
- Badge "Reported" untuk review yang sudah di-report
- Update avatar source untuk konsistensi dengan backend

#### Service (`frontend/src/lib/service.js`)
- Function `reportReview()` untuk API call

### 3. Admin Features

#### Review Moderation (`frontend/src/components/admin/ReviewModeration.jsx`)
- Sudah mendukung filter by report status
- Menampilkan badge "Reported" untuk review yang di-report
- Admin bisa melihat detail reporter dan alasan report

## Cara Penggunaan

### Untuk User:
1. Buka halaman detail movie
2. Scroll ke section reviews
3. Klik icon flag (🚩) pada review yang ingin di-report
4. Masukkan alasan report
5. Klik "Report Review"

### Untuk Admin:
1. Login sebagai admin
2. Buka Admin Dashboard > Review Moderation
3. Filter by "Reported Only" untuk melihat review yang di-report
4. Admin bisa menghapus review yang tidak pantas

## Validasi dan Keamanan

- User tidak bisa report review sendiri
- User tidak bisa report review yang sama dua kali
- Admin endpoint memerlukan authentication dan admin role
- Report endpoint memerlukan authentication

## Database Schema

```javascript
// Review Model - Field Baru
reportedBy: [{
    user: ObjectId (ref: User),
    reason: String,
    reportedAt: Date
}]
```

## API Response

```javascript
// POST /api/reviews/:reviewId/report
{
    "success": true,
    "message": "Review reported successfully",
    "data": {
        "isReported": true,
        "reportCount": 1,
        "message": "Review reported successfully"
    }
}
```

Fitur ini sekarang siap digunakan dan terintegrasi dengan sistem admin yang sudah ada!
