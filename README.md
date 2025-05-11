Tubes Kontruksi Perangkat Lunak

Pembagian Tubes
👤 Muhammad Mahrus Ali
Peran: Frontend
Fokus: Code reuse / library, Runtime configuration
Tugas:

Mengelola dan menstruktur ulang utils.js & config.js agar kode bisa digunakan ulang.

Implementasi API_BASE_URL di config.js dan integrasinya ke file lain seperti script.js.

Memastikan semua fetch API menggunakan base URL dari konfigurasi.

File yang dikerjakan:

Frontend/libs/utils.js

Frontend/libs/config.js

Kontribusi ke script.js

👤 Muhammad Fathi Rafa
Peran: Backend
Fokus: API, Parameterization / generics
Tugas:

Mengembangkan REST API di server.js.

Memastikan API mendukung parameterisasi seperti filtering via query (misal: GET /customers?status=active).

Pastikan fungsi-fungsi backend reusable (parameterized), misalnya fungsi getCustomerBy(filter).

File yang dikerjakan:

Backend/server.js

Backend/package.json

👤 Eduardo Bagus Prima Julian
Peran: Database
Fokus: Code reuse / library, Automata
Tugas:

Menyusun logika automata (misalnya validasi state data customer) di backend.

Membuat fungsi-fungsi reusable untuk manipulasi data customer (CRUD).

Simulasikan database sederhana (bisa pakai JSON file atau tambahkan SQLite/lowdb jika diizinkan).

File yang dikerjakan:

Backend/server.js (bagian database handler)

File JSON/DB tambahan jika ada

👤 Reza Irawan
Peran: Dokumentasi & QA
Fokus: Runtime configuration, Automata
Tugas:

Dokumentasi sistem konfigurasi (di config.js) dan automata (state diagram atau deskripsi logika).

Menulis README dan dokumentasi teknis + user guide.

Melakukan pengujian fitur runtime config dan validasi UI state (otomata) dengan skenario manual/otomatis.

File yang dikerjakan:

Dokumentasi di README.md

QA/test case dokumentasi (bisa buat folder tests/)

Review config.js, script.js

👤 Fajar Budikdaya
Peran: Sistem Otentikasi
Fokus: API, Table-driven construction
Tugas:

Menyusun API login/register (bisa disimulasikan di server.js).

Implementasi logic otentikasi berbasis role/permission menggunakan table-driven (misalnya roles = { admin: [...], user: [...] }).

Pastikan routing atau aksi spesifik dibatasi lewat table logika hak akses.

File yang dikerjakan:

Backend/server.js (autentikasi)

Tambahan file otentikasi (opsional: auth.js)

Bisa buat file roles.js atau sistem role-driven access