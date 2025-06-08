# Sistem Keuangan KSM Tanjung

Sistem informasi pengelolaan keuangan untuk Kelompok Swadaya Masyarakat (KSM) Tanjung yang dikembangkan sebagai bagian dari tugas mata kuliah KPL (Konstruksi Perangkat Lunak).

## 📋 Deskripsi

Sistem Keuangan KSM Tanjung adalah aplikasi web fullstack yang dirancang untuk membantu pengelolaan keuangan kelompok swadaya masyarakat secara digital. Aplikasi ini menggunakan arsitektur modern dengan pemisahan frontend dan backend untuk kemudahan pengembangan dan maintenance.

## ✨ Fitur Utama

- **Manajemen Anggota**: Pendaftaran dan pengelolaan data anggota KSM
- **Pencatatan Transaksi**: Input transaksi pemasukan dan pengeluaran
- **Laporan Keuangan**: Generate laporan bulanan dan tahunan
- **Dashboard**: Overview kondisi keuangan KSM
- **Manajemen User**: Sistem login dan hak akses pengguna
- **Export Data**: Export laporan ke format PDF/Excel

## 🏗️ Arsitektur Aplikasi

Proyek ini menggunakan arsitektur fullstack dengan pemisahan yang jelas:

- **Frontend**: Interface pengguna modern dengan JavaScript
- **Backend**: API server dengan Node.js
- **Database**: Penyimpanan data terstruktur

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5** - Struktur halaman web
- **CSS3** - Styling dan responsive design
- **JavaScript** - Interaktivitas dan dynamic content

### Backend
- **Node.js** - Runtime JavaScript server-side
- **Express.js** - Web framework (kemungkinan)
- **Package.json** - Dependency management

### Development Tools
- **Package-lock.json** - Lock file untuk konsistensi dependency
- **Server.js** - Entry point aplikasi server
- **ServerStart.js** - Script untuk menjalankan server

## 📦 Instalasi

### Prasyarat

Pastikan sistem Anda memiliki:
- **Node.js** >= 14.x
- **npm** atau **yarn**
- **Git**

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/mfathirafa/CLO4_SistemKeuanganKSMTanjung_KPL.git
   cd CLO4_SistemKeuanganKSMTanjung_KPL
   ```

2. **Install Dependencies Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Install Dependencies Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Konfigurasi Environment**
   
   Buat file `.env` di folder backend:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=ksm_keuangan
   JWT_SECRET=your_secret_key
   ```

5. **Menjalankan Aplikasi**
   
   **Backend Server:**
   ```bash
   cd backend
   npm start
   # atau
   node server.js
   # atau
   node serverStart.js
   ```
   
   **Frontend (jika terpisah):**
   ```bash
   cd frontend
   # Buka index.html di browser atau gunakan live server
   ```

## 📁 Struktur Direktori

```
CLO4_SistemKeuanganKSMTanjung_KPL/
├── backend/
│   ├── node_modules/
│   ├── routes/
│   ├── tests/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── serverStart.js
├── frontend/
│   ├── config.js
│   ├── data.js
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── utils.js
├── package-lock.json
├── package.json
└── README.md
```

## 🚀 Menjalankan Aplikasi

### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev  # atau npm start
   ```
   Server akan berjalan di `http://localhost:3000`

2. **Start Frontend**
   ```bash
   cd frontend
   # Buka index.html dengan live server atau browser
   ```

### Production Mode

```bash
cd backend
npm run start
```

## 🔧 Konfigurasi

### Backend Configuration
File konfigurasi utama terletak di:
- `backend/package.json` - Dependencies dan scripts
- `backend/config/` - Database dan environment config (jika ada)

### Frontend Configuration
- `frontend/config.js` - Konfigurasi API endpoints dan constants
- `frontend/utils.js` - Utility functions dan helpers

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints (Estimasi)
- `GET /api/anggota` - Mendapatkan daftar anggota
- `POST /api/anggota` - Menambah anggota baru
- `GET /api/transaksi` - Mendapatkan daftar transaksi
- `POST /api/transaksi` - Menambah transaksi baru
- `GET /api/laporan` - Generate laporan keuangan

## 🧪 Testing

Menjalankan test suite:

```bash
cd backend
npm test
```

Test files terletak di folder `backend/tests/`

## 🤝 Tim Pengembang

### Contributors (4 orang)
- **Muhammad Fathi Rafa** - [@mfathirafa](https://github.com/mfathirafa) - Project Lead
- **Eduardo Bagus** - [@eduardobagus](https://github.com/eduardobagus) - Developer
- **Alialkozini** - [@Alialkozini](https://github.com/Alialkozini) - Developer
- **Rejalrawan** - [@Rejalrawan](https://github.com/Rejalrawan) - Developer

## 📊 Statistik Proyek

- **29 Commits** - Aktif dikembangkan
- **6 Branches** - Multiple feature development
- **Bahasa Utama**: 
  - JavaScript (83.7%)
  - HTML (8.5%)
  - CSS (7.8%)

## 🔄 Development Workflow

### Branches
Proyek ini menggunakan 6 branches untuk pengembangan fitur yang berbeda:
- `main` - Production branch
- `backend` - Backend development
- `frontend` - Frontend development
- `feature/*` - Feature-specific branches

### Recent Updates
- **Final commits** - Stabilisasi kode
- **Module organization** - Restructuring kode
- **Code reuse implementation** - Optimisasi kode

## 🚀 Deployment

### Development
```bash
# Clone dan setup
git clone https://github.com/mfathirafa/CLO4_SistemKeuanganKSMTanjung_KPL.git
cd CLO4_SistemKeuanganKSMTanjung_KPL
npm install
npm start
```

### Development Guidelines
- Gunakan consistent coding style
- Tulis commit messages yang jelas
- Test semua fitur sebelum push
- Update documentation jika diperlukan

## 📝 License

Proyek ini dibuat untuk keperluan akademik dalam mata kuliah Konstruksi Perangkat Lunak (KPL).

## 🔄 Changelog

### Latest Updates
- **Final release** - Stabilisasi semua fitur
- **Code refactoring** - Peningkatan struktur kode
- **Module separation** - Pemisahan backend dan frontend
- **Testing implementation** - Penambahan test suite

---

**Note**: Proyek ini merupakan tugas mata kuliah KPL dan dikembangkan untuk tujuan pembelajaran dalam pengembangan aplikasi web fullstack.
