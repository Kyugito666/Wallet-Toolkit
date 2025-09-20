<div align="center">
  <img src="https://raw.githubusercontent.com/Kyugito666/Kyugito666/main/assets/duong2.gif" alt="Logo" width="200">
  <h1 align="center">Wallet Toolkit CLI</h1>
  <p align="center">
    Sebuah alat antarmuka baris perintah (CLI) yang serbaguna untuk mengelola dompet kripto multi-jaringan. Buat, muat, dan periksa saldo untuk jaringan berbasis EVM, Solana, dan Sui dengan mudah.
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-18.x+-green?style=for-the-badge&logo=nodedotjs" alt="Node.js Version">
    <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/static/v1?label=PRs&message=welcome&color=brightgreen&style=for-the-badge" alt="PRs Welcome">
    <img src="https://img.shields.io/github/stars/Kyugito666/wallet-toolkit?style=for-the-badge&logo=github&label=Stars" alt="GitHub Stars">
  </p>
</div>

---

## 🌟 Tampilan Antarmuka

Wallet Toolkit CLI menawarkan antarmuka yang bersih dan interaktif untuk navigasi yang mudah, bahkan untuk pengguna baru sekalipun.

```text
     ┌───────────────────────────────────┐
     │       Crypto Wallet Toolkit       │
     │ Dibuat oleh: Kyugito666 & Gemini  │
     └───────────────────────────────────┘

      Dompet Aktif: 0x1234...AbCd

     ╭────────────── Wallet Aktif ──────────────╮
     │ Pilihan    │ Deskripsi                   │
     ├────────────┼─────────────────────────────┤
     │ [1]        │ Cek Saldo                   │
     │ [2]        │ Tampilkan Detail Lengkap    │
     │ [3]        │ Simpan Ulang ke File        │
     │ [4]        │ Faucet (Coming Soon)        │
     │ [5]        │ Keluarkan Wallet (Kembali)  │
     ╰────────────┴─────────────────────────────╯
     Pilih Aksi: › Cek Saldo
````

-----

## ✨ Fitur Utama

  - **Dukungan Multi-Jaringan**: Kelola aset di **EVM** (Ethereum, BSC, Polygon, dll.), **Solana**, dan **Sui** dari satu tempat.
  - **Pembuatan & Impor Wallet**: Buat wallet baru secara instan atau muat *mnemonic phrase* yang sudah ada dari file `phrase.txt`.
  - **Pengecekan Saldo Real-time**: Periksa saldo token native (ETH, SOL, SUI) di jaringan `mainnet` atau `testnet`.
  - **Pencadangan Aman & Otomatis**: Setiap wallet yang dibuat atau dimuat akan secara otomatis dicadangkan ke dalam file `.txt` terpisah untuk setiap detailnya (alamat, kunci privat, mnemonic).
  - **Antarmuka Interaktif**: Pengalaman pengguna yang ramah dengan menu berbasis `inquirer` yang jelas dan mudah dinavigasi.
  - **Tampilan Detail Lengkap**: Tampilkan alamat dan kunci privat untuk semua jaringan dalam format tabel yang rapi dan mudah dibaca.

-----

## 🚀 Memulai

Ikuti langkah-langkah ini untuk menjalankan Wallet Toolkit CLI di sistem Anda.

### 1\. Prasyarat

  - [Node.js](https://nodejs.org/en/download/) (v18 atau lebih baru).
  - [Git](https://git-scm.com/downloads).

### 2\. Instalasi

Proses instalasi dibagi per langkah agar mudah diikuti.

#### Untuk Windows, Linux & macOS

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/Kyugito666/Wallet-Toolkit.git
    ```
2.  **Masuk ke Direktori Proyek**
    ```bash
    cd wallet-toolkit
    ```
3.  **Instal Dependensi**
    ```bash
    npm install
    ```

-----

## ⚙️ Cara Penggunaan

1.  **Jalankan Aplikasi**: Dari dalam direktori proyek, jalankan perintah:
    ```bash
    npm start
    ```
2.  **Pilih Menu Utama**:
      - Pilih **'Buat Wallet Baru'** untuk menghasilkan *mnemonic phrase* baru. Detail wallet akan langsung ditampilkan dan disimpan.
      - Pilih **'Muat Wallet dari File'** untuk mengimpor wallet dari `phrase.txt` yang sudah ada.
3.  **Gunakan Fitur**: Setelah wallet aktif, Anda dapat menggunakan berbagai fitur seperti mengecek saldo, melihat detail, atau melakukan backup ulang.

-----

## 📁 Struktur Proyek

```
/wallet-toolkit
├── index.js          # Skrip utama & logika alur aplikasi
├── crypto.js         # Fungsi inti terkait kriptografi (pembuatan kunci, cek saldo)
├── ui.js             # Semua komponen antarmuka pengguna (menu, tabel, notifikasi)
├── package.json      # Konfigurasi proyek dan daftar dependensi
└── phrase.txt        # (Dibuat otomatis) Tempat menyimpan mnemonic phrase Anda
```

-----

## ✍️ Kreator

Proyek ini dibuat dan dikelola dengan ❤️ oleh:

| Avatar | Kontributor | Peran |
| :---: |:---:|:---:|
| <img src="https://avatars.githubusercontent.com/Kyugito666" width="50" style="border-radius:50%"> | **[Kyugito666](https://github.com/Kyugito666)** | Konsep & Pengembangan Utama |
| <img src="https://raw.githubusercontent.com/Kyugito666/Kyugito666/main/assets/gemini.png" width="50" style="border-radius:50%"> | **Gemini AI** | Asisten & Refactoring Kode |

Jangan ragu untuk mengunjungi profil saya dan melihat proyek-proyek lainnya\!

[](https://github.com/Kyugito666)

-----

## 🚀 Proyek Lainnya

Lihat juga beberapa proyek saya yang lain:

  - **[ProxySync](https://github.com/Kyugito666/ProxySync)**: Tool CLI canggih untuk memvalidasi, mengelola, dan mendistribusikan daftar proxy Anda.
  - **[dummy-contrib](https://github.com/Kyugito666/dummy-contrib)**: Sebuah skrip sederhana untuk menghasilkan kontribusi palsu di kalender aktivitas GitHub Anda.

-----

## 📄 Lisensi
