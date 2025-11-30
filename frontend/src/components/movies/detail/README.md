# Movie Detail Components

## MovieGallery Component

Komponen MovieGallery menampilkan galeri gambar film dengan fitur-fitur berikut:

### Fitur:
- **Image Navigation**: Navigasi dengan tombol prev/next
- **Thumbnail Navigation**: Thumbnail kecil untuk navigasi cepat
- **Fullscreen Mode**: Mode fullscreen untuk melihat gambar lebih detail
- **Download Feature**: Download gambar yang sedang ditampilkan
- **Image Counter**: Menampilkan posisi gambar saat ini
- **Responsive Design**: Menyesuaikan dengan berbagai ukuran layar
- **Sample Images**: Otomatis menggunakan sample images jika tidak ada data gallery

### Penggunaan:

```jsx
import MovieGallery from "@/components/movies/detail/MovieGallery";

// Dengan data gallery dari API
<MovieGallery images={movie.gallery} />

// Akan otomatis menggunakan sample images jika tidak ada data
<MovieGallery images={[]} />
```

### Props:
- `images` (array): Array URL gambar untuk gallery. Jika kosong, akan menggunakan sample images.

### Data Structure:
```javascript
// Dari API movie
{
  gallery: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]
}
```

### Keyboard Support:
- **Arrow Keys**: Navigasi gambar (akan ditambahkan di versi selanjutnya)
- **Escape**: Keluar dari fullscreen mode (akan ditambahkan di versi selanjutnya)

### Styling:
- Menggunakan Shadcn UI components
- Responsive design dengan Tailwind CSS
- Hover effects dan smooth transitions
- Dark mode support

## CastSection Component

Komponen CastSection menampilkan daftar cast dengan gaya seperti IMDb:

### Fitur:
- **Large Avatars**: Avatar besar untuk setiap cast member
- **Character Information**: Menampilkan nama aktor dan karakter
- **Responsive Grid**: Grid yang menyesuaikan dengan ukuran layar
- **Hover Effects**: Efek hover pada avatar

### Penggunaan:

```jsx
import CastSection from "@/components/movies/detail/CastSection";

<CastSection cast={movie.cast} />
```

## MovieMeta Component

Komponen MovieMeta menampilkan informasi detail film:

### Fitur:
- **Movie Details**: Tahun, durasi, rating, dll
- **Director Info**: Informasi dan foto director
- **Writers Info**: Daftar writers dengan foto
- **Genres**: Daftar genre film

### Penggunaan:

```jsx
import MovieMeta from "@/components/movies/detail/MovieMeta";

<MovieMeta movie={movie} />
```
