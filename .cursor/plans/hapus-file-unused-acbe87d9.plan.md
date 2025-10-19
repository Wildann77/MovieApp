<!-- acbe87d9-4cfa-4fce-953a-02f5274b1b33 455c5975-3aad-4440-8d20-ee25fa3b5998 -->
# Hapus File dan Folder yang Tidak Digunakan

## Ringkasan

Membersihkan codebase frontend dengan menghapus file, folder, dan dokumentasi yang tidak digunakan atau tidak direferensikan dalam aplikasi.

## File yang Akan Dihapus

### 1. Dokumentasi

- `frontend/REFACTORING_SUMMARY.md`
- `frontend/TESTING_CHECKLIST.md`

### 2. Folder Kosong

- `frontend/src/app/` (termasuk subfolder dashboard yang kosong)
- `frontend/src/utils/` (folder kosong)

### 3. Asset Tidak Digunakan

- `frontend/src/assets/react.svg`

### 4. Library Helper Tidak Digunakan

- `frontend/src/lib/helpers.js`
- `frontend/src/lib/formatters.js`
- `frontend/src/lib/index.js` (re-export yang tidak digunakan)

### 5. Component Tidak Digunakan

- `frontend/src/components/features-1.jsx`

### 6. Data Mock

- `frontend/src/data/dashboard.json`
- `frontend/src/data/` (folder akan kosong setelah file dihapus)

### 7. Index Files Tidak Digunakan

- `frontend/src/components/navigation/index.js`
- `frontend/src/components/movie/index.js`
- `frontend/src/components/actors/detail/index.js`
- `frontend/src/components/review/index.js`
- `frontend/src/components/profile/index.js`
- `frontend/src/hooks/forms/index.js`
- `frontend/src/hooks/ui/index.js`

### 8. Component Tidak Digunakan Lainnya

- `frontend/src/components/shared/OptimizedSearchSelect.jsx` (tidak ada yang mengimport)

### 9. Build Output (Opsional)

- `frontend/dist/` (dapat di-generate ulang)

## Catatan

- File `lib/validators.js` akan **TETAP DIPERTAHANKAN** karena digunakan di LoginForm dan SignupForm
- Index files di `components/forms/`, `components/layouts/`, `components/lists/`, dan `components/shared/` akan **TETAP DIPERTAHANKAN** karena aktif digunakan
- Index files di `dashboard/movie-form/`, `dashboard/master-data/`, dan `dashboard/master-data/config/` akan **TETAP DIPERTAHANKAN** karena aktif digunakan
- File `components/movies/detail/README.md` akan **TETAP DIPERTAHANKAN** karena merupakan dokumentasi komponen
- Semua hooks seperti `use-casts`, `use-movies-by-actor`, dll **TETAP DIPERTAHANKAN** karena digunakan

## Total

Akan menghapus **20 file/folder** yang tidak digunakan.

### To-dos

- [ ] Hapus file dokumentasi yang tidak digunakan (REFACTORING_SUMMARY.md, TESTING_CHECKLIST.md)
- [ ] Hapus folder kosong (src/app/, src/utils/)
- [ ] Hapus asset yang tidak digunakan (react.svg)
- [ ] Hapus library helper yang tidak digunakan (helpers.js, formatters.js, lib/index.js)
- [ ] Hapus component yang tidak digunakan (features-1.jsx)
- [ ] Hapus data mock dan folder data (dashboard.json, src/data/)
- [ ] Hapus index files yang tidak digunakan (navigation, movie, actors/detail, review, profile)
- [ ] Hapus folder dist (build output)