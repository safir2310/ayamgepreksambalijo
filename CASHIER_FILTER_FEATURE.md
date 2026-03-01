# Fitur Filter Kasir di Export Laporan Penjualan

## ✅ Fitur Baru: Filter Kasir!

Fitur filter kasir telah ditambahkan ke dialog "Ekspor Laporan Penjualan" di admin dashboard!

---

## 🎯 Apa yang Baru?

Sekarang Anda bisa memfilter laporan penjualan berdasarkan:
1. ✅ **Kasir** (User yang membuat/menangani pesanan) - BARU!
2. ✅ Status pesanan
3. ✅ Rentang tanggal

---

## 🚀 Cara Menggunakan:

### 1. Buka Dialog Ekspor
- Login sebagai admin
- Masuk ke tab **Pesanan**
- Klik tombol **"Ekspor"** (hijau dengan ikon Download)

### 2. Filter Berdasarkan Kasir
Di dialog export, sekarang ada opsi **"Filter Kasir"** dengan dropdown:
- **"Semua Kasir"** - Tampilkan semua pesanan dari semua kasir
- **[Nama Kasir]** - Tampilkan hanya pesanan dari kasir tertentu

### 3. Kombinasi Filter
Anda bisa menggabungkan filter:
- Kasir: "Budi" + Status: "Selesai"
- Kasir: "Siti" + Tanggal: "2024-01-01" sampai "2024-01-31"
- Kasir: "Ahmad" + Status: "Selesai" + Tanggal: Bulan ini

### 4. Ekspor
- Pilih format (Excel atau CSV)
- Klik **"Ekspor"**
- File akan otomatis diunduh dengan data sesuai filter

---

## 📊 Kolom Baru di Export:

### CSV (.csv):
| Kolom | Deskripsi |
|-------|-----------|
| ID Pesanan | ID unik pesanan |
| Tanggal | Tanggal dan waktu pesanan |
| Nama Pelanggan | Nama pelanggan |
| No HP | Nomor HP pelanggan |
| Alamat | Alamat pelanggan |
| Status | Status pesanan |
| **Kasir** | **Username kasir yang menangani pesanan** ← BARU! |
| Total | Total nilai pesanan |
| Poin | Poin yang didapat pelanggan |
| Item Pesanan | Detail item yang dipesan |

### Excel (.xlsx):
- **Sheet 1: Ringkasan** - Statistik laporan
- **Sheet 2: Pesanan** - Detail setiap pesanan dengan kolom **Kasir**

---

## 🎨 Tampilan Dialog Export dengan Filter Kasir:

```
┌─────────────────────────────────────────────────────────┐
│  📊 Ekspor Laporan Penjualan                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Total Pesanan: 25    Total Penjualan: Rp 2.5M         │
│                                                         │
│  Pilih Format:                                         │
│  ┌───────────┐  ┌───────────┐                           │
│  │   Excel   │  │   CSV     │                           │
│  │   ✓       │  │           │                           │
│  └───────────┘  └───────────┘                           │
│                                                         │
│  👤 Filter Kasir:                                       │
│  [ Semua Kasir ▼ ]                                      │
│                                                         │
│  Filter Status:                                         │
│  [ Semua Status ▼ ]                                     │
│                                                         │
│  Dari Tanggal:    Sampai Tanggal:                       │
│  [ 2024-01-01 ]  [ 2024-12-31 ]                        │
│                                                         │
│  10 pesanan akan diekspor (kasir: Budi)               │
│                                                         │
│                   [Batal] [Ekspor Excel]                  │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Use Cases Filter Kasir:

### Use Case 1: Laporan Penjualan per Kasir
Memfilter laporan penjualan berdasarkan kasir tertentu untuk:
- Menghitung performa kasir
- Bonus kasir berdasarkan penjualan
- Audit transaksi per kasir

### Use Case 2: Komisi Kasir
Menghitung komisi kasir:
- Filter berdasarkan kasir: "Budi"
- Filter tanggal: Bulan ini
- Filter status: "Selesai"
- Ekspor Excel → Hitung total penjualan untuk komisi

### Use Case 3: Shift Management
Memantau performa kasir per shift:
- Filter kasir: "Siti" (shift pagi)
- Filter tanggal: Hari ini
- Ekspor untuk analisis shift

---

## 🔧 Technical Details:

### 1. Filter Logic
```typescript
// Filter by cashier
if (cashierFilter !== 'all') {
  filtered = filtered.filter(order => order.userId === cashierFilter)
}
```

### 2. Get Unique Cashiers
```typescript
const getCashiers = () => {
  const cashiers = new Map<string, string>()
  orders.forEach(order => {
    if (order.user?.username) {
      cashiers.set(order.userId, order.user.username)
    }
  })
  return Array.from(cashiers.entries()).map(([id, name]) => ({ id, name }))
}
```

### 3. Export Data (CSV & Excel)
Menambahkan kolom "Kasir" dengan data:
```typescript
'Kasir': order.user?.username || '-',
```

---

## 📝 Perubahan yang Dibuat:

### File yang Diupdate:
- `src/components/ExportReportDialog.tsx`

### Perubahan:
1. ✅ Tambah state `cashierFilter`
2. ✅ Tambah fungsi `getCashiers()` untuk mengambil daftar kasir unik
3. ✅ Update `getFilteredOrders()` untuk filter berdasarkan kasir
4. ✅ Tambah UI dropdown "Filter Kasir" dengan ikon User
5. ✅ Update exportToCSV untuk menambahkan kolom Kasir
6. ✅ Update exportToExcel untuk menambahkan kolom Kasir
7. ✅ Update preview message untuk menampilkan filter kasir
8. ✅ Update reset filter untuk menyertakan `cashierFilter`

---

## 🎯 Benefits Filter Kasir:

1. **Transparansi** - Tahu siapa yang menangani setiap pesanan
2. **Akuntabilitas** - Melacak performa per kasir
3. **Analisis** - Menganalisis penjualan per kasir
4. **Bonus/Komisi** - Menghitung komisi berdasarkan performa
5. **Audit** - Audit trail untuk setiap transaksi

---

## 📊 Contoh Hasil Export:

### Preview dengan Filter Kasir:
```
10 pesanan akan diekspor (kasir: Budi) (dengan filter tanggal) (status: Selesai)
```

### Data di Excel/CSV:
| ID Pesanan | Nama Pelanggan | Kasir | Total | Status |
|------------|----------------|--------|-------|--------|
| #ABC123    | John Doe      | Budi   | Rp 50.000 | Selesai |
| #DEF456    | Jane Smith    | Budi   | Rp 75.000 | Selesai |
| #GHI789    | Bob Johnson   | Budi   | Rp 30.000 | Selesai |

---

## 🔍 Cara Mencoba Fitur:

1. Buka admin dashboard
2. Masuk ke tab "Pesanan"
3. Klik tombol "Ekspor"
4. Pilih kasir dari dropdown "Filter Kasir"
5. Lihat preview data yang berubah
6. Pilih format (Excel atau CSV)
7. Klik "Ekspor"
8. Buka file yang diunduh
9. Cek kolom "Kasir" di file

---

## ✅ Checklist:

- [x] Filter kasir berdasarkan userId
- [x] Dropdown daftar kasir unik
- [x] Kolom "Kasir" di export CSV
- [x] Kolom "Kasir" di export Excel
- [x] Ikon User pada label Filter Kasir
- [x] Preview menampilkan filter kasir
- [x] Reset filter menyertakan kasir
- [x] Handle kasir yang tidak ada (show '-')
- [x] Responsive design

---

## 🚀 Next Steps:

Fitur filter kasir sudah siap digunakan! Coba di admin dashboard dan export laporan penjualan per kasir.

Jika ingin menambahkan fitur lain seperti:
- Group by kasir di ringkasan
- Komisi kasir otomatis
- Laporan performa kasir
- Chart performa kasir

Beritahu dan saya akan bantu implementasikan!

---

**Fitur Filter Kasir siap digunakan! 🎉👤**
