<div align="center">
  <img src="https://raw.githubusercontent.com/Kyugito666/Kyugito666/main/assets/duong2.gif" alt="Logo" width="200">
  <h1 align="center">Wallet Toolkit CLI</h1>
  <p align="center">
    Sebuah alat antarmuka baris perintah (CLI) yang serbaguna untuk mengelola dompet kripto multi-jaringan. Buat, muat, dan sinkronkan dompet untuk jaringan berbasis EVM, Solana, dan Sui dengan mudah.
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

Wallet Toolkit CLI menawarkan antarmuka yang bersih dan interaktif, kini dengan fitur sinkronisasi otomatis yang canggih.

```text
     ┌───────────────────────────────────┐
     │       Crypto Wallet Toolkit       │
     │ Dibuat oleh: Kyugito666 & Gemini  │
     └───────────────────────────────────┘

      Belum ada dompet yang aktif.

     ╭────────────────── Menu ───────────────────╮
     │ Pilihan    │ Deskripsi                    │
     ├────────────┼──────────────────────────────┤
     │ [1]        │ Buat Wallet Baru             │
     │ [2]        │ Muat Wallet dari File        │
     │ [3]        │ Sinkronkan Wallet dari ...   │
     │ [4]        │ Keluar                       │
     ╰────────────┴──────────────────────────────╯
     Pilih Aksi: › Sinkronkan Wallet dari phrase.txt
````

-----

## ✨ Fitur Utama

  - **Dukungan Multi-Jaringan**: Kelola aset di **EVM** (Ethereum, BSC, Polygon, dll.), **Solana**, dan **Sui** dari satu tempat.
  - **Sinkronisasi Otomatis**: Cukup tambahkan *seed phrase* baru Anda ke `phrase.txt`, dan jalankan fitur sinkronisasi. Aplikasi akan secara otomatis mendeteksi dan menyimpan alamat serta *private key* untuk semua *phrase* yang belum tersimpan.
  - **Deteksi Duplikat Cerdas**: Fitur sinkronisasi secara otomatis akan melewati *phrase* yang detailnya sudah tersimpan, memastikan tidak ada data ganda di file Anda.
  - **Penyimpanan Bersih & Rapi**: Semua detail (alamat, kunci privat, dan *mnemonic*) disimpan dalam format teks murni, satu entri per baris, tanpa awalan tanggal atau metadata tambahan. Ini membuat file mudah dibaca dan dikelola.
  - **Pengecekan Saldo Real-time**: Periksa saldo token native (ETH, SOL, SUI) di jaringan `mainnet` atau `testnet` untuk dompet yang sedang aktif.
  - **Antarmuka Interaktif**: Pengalaman pengguna yang ramah dengan menu berbasis `inquirer` yang jelas dan mudah dinavigasi.

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

1.  **(Opsional) Tambahkan Seed Phrase**: Buka file `phrase.txt` dan tambahkan *seed phrase* Anda, masing-masing di baris baru.
2.  **Jalankan Aplikasi**: Dari dalam direktori proyek, jalankan perintah:
    ```bash
    npm start
    ```
3.  **Pilih Menu Utama**:
      - **'Buat Wallet Baru'**: Untuk menghasilkan *mnemonic phrase* baru. Detailnya akan langsung ditampilkan dan disimpan ke semua file `.txt` yang relevan.
      - **'Muat Wallet dari File'**: Untuk memilih dan mengaktifkan salah satu *wallet* dari `phrase.txt`.
      - **'Sinkronkan Wallet dari phrase.txt'**: Untuk mengekstrak secara massal alamat dan kunci privat dari semua *phrase* di `phrase.txt` yang belum pernah diproses.

-----

## 📁 Struktur Proyek

```
/wallet-toolkit
├── index.js                # Skrip utama & logika alur aplikasi
├── crypto.js               # Fungsi inti terkait kriptografi
├── ui.js                   # Semua komponen antarmuka pengguna
├── package.json            # Konfigurasi proyek dan dependensi
├── phrase.txt              # (Dibuat otomatis) Tempat menyimpan mnemonic Anda
├── address_evm.txt         # (Dibuat otomatis) Alamat EVM
├── privatekey_evm.txt      # (Dibuat otomatis) Kunci Privat EVM
├── address_sol.txt         # (Dibuat otomatis) Alamat Solana
├── privatekey_sol.txt      # (Dibuat otomatis) Kunci Privat Solana
├── address_sui.txt         # (Dibuat otomatis) Alamat Sui
└── privatekey_sui.txt      # (Dibuat otomatis) Kunci Privat Sui
```

-----

## ✍️ Kreator

Proyek ini dibuat dan dikelola dengan ❤️ oleh:

| Avatar                                                                                     | Kontributor                               | Peran                       |
| :----------------------------------------------------------------------------------------- | :---------------------------------------- | :-------------------------- |
| <img src="https://avatars.githubusercontent.com/Kyugito666" width="50" style="border-radius:50%"> | **[Kyugito666](https://github.com/Kyugito666)** | Konsep & Pengembangan Utama |
| <img src="https://raw.githubusercontent.com/Kyugito666/Kyugito666/main/assets/gemini.png" width="50" style="border-radius:50%"> | **Gemini AI** | Asisten & Refactoring Kode  |

Jangan ragu untuk mengunjungi profil saya dan melihat proyek-proyek lainnya\!

-----

## 🚀 Proyek Lainnya

Lihat juga beberapa proyek saya yang lain:

  - **[ProxySync](https://github.com/Kyugito666/ProxySync)**: Tool CLI canggih untuk memvalidasi, mengelola, dan mendistribusikan daftar proxy Anda.
  - **[dummy-contrib](https://github.com/Kyugito666/dummy-contrib)**: Sebuah skrip sederhana untuk menghasilkan kontribusi palsu di kalender aktivitas GitHub Anda.

-----

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi ISC.

```

Dokumentasi ini sekarang sudah akurat dan keren, sama seperti skripnya!
```
