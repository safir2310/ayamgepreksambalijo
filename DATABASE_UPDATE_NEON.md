# Database String Update - Neon PostgreSQL

## ✅ Database String Berhasil Diupdate!

String database Neon sudah diupdate di file `.env` lokal dengan konfigurasi lengkap dari Neon.

---

## 📊 Database Configuration Update

### ✅ File Lokal (`.env`)
Semua environment variables Neon sudah ditambahkan:

```env
# Neon Database Configuration
DATABASE_URL=postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

PGHOST=ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-ancient-paper-aiifvyrx.c-4.us-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=[YOUR_PASSWORD]

POSTGRES_URL=postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=[YOUR_PASSWORD]
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```

---

## ⚠️ PERLU DILAKUKAN: Update Environment Variables di Vercel

**File `.env` TIDAK di-commit ke Git** (ada di .gitignore) karena berisi sensitive data.

Anda perlu **manual update environment variables di Vercel Dashboard** untuk production.

---

## 🔧 Cara Update Environment Variables di Vercel:

### 1. Buka Vercel Dashboard
- Kunjungi: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Pilih project: `ayamgepreksambalijo1`

### 2. Masuk ke Settings
- Klik tab **Settings**
- Pilih menu **Environment Variables**

### 3. Tambahkan/Update Variables Berikut:

#### A. Database Variables

| Name | Value | Environments |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `DATABASE_URL_UNPOOLED` | `postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `POSTGRES_PRISMA_URL` | `postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require` | Production, Preview, Development |
| `POSTGRES_URL` | `postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `POSTGRES_USER` | `neondb_owner` | Production, Preview, Development |
| `POSTGRES_HOST` | `ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech` | Production, Preview, Development |
| `POSTGRES_PASSWORD` | `[YOUR_PASSWORD]` | Production, Preview, Development |
| `POSTGRES_DATABASE` | `neondb` | Production, Preview, Development |

#### B. Other Variables

| Name | Value | Environments |
|------|-------|-------------|
| `RESEND_API_KEY` | `[YOUR_RESEND_API_KEY]` | Production, Preview, Development |
| `VERCEL_API_TOKEN` | `[YOUR_VERCEL_API_TOKEN]` | All |
| `DOMAIN_NAME` | `ayamgepreksambalijo.com` | All |

### 4. Save dan Redeploy
- Setelah semua variables ditambahkan, klik **Save**
- Masuk ke tab **Deployments**
- Klik tombol **"..."** di deployment terbaru
- Klik **Redeploy**

---

## 🎯 Perbedaan Database Strings:

### 1. DATABASE_URL (Default)
```
postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
```
- Menggunakan **pgbouncer** (connection pooler)
- **Recommended** untuk sebagian besar use case
- Lebih efisien untuk banyak koneksi

### 2. DATABASE_URL_UNPOOLED
```
postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
```
- **Tanpa** pgbouncer
- Koneksi langsung ke database
- Untuk use case yang memerlukan koneksi tanpa pooler

### 3. POSTGRES_PRISMA_URL (Best untuk Prisma)
```
postgresql://neondb_owner:[YOUR_PASSWORD]@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```
- **Optimized untuk Prisma ORM**
- Dengan `connect_timeout=15`
- Untuk deployment di Vercel

---

## 🚀 Setelah Update di Vercel:

### 1. Redeploy
Setelah environment variables diupdate, redeploy project untuk mengaktifkan perubahan:
- Vercel Dashboard → Deployments → Redeploy

### 2. Test Database Connection
Setelah deploy selesai, pastikan:
- Data products bisa di-load
- Data orders bisa di-load
- User bisa login/register

### 3. Test Fitur Lain
- Export Excel/CSV
- Email laporan
- Semua fitur yang menggunakan database

---

## 📝 Environment Variables Lokal vs Production:

| Variable | Local (.env) | Production (Vercel) | Status |
|----------|---------------|---------------------|--------|
| DATABASE_URL | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| DATABASE_URL_UNPOOLED | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| POSTGRES_PRISMA_URL | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| POSTGRES_URL | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| POSTGRES_USER | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| POSTGRES_HOST | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| POSTGRES_PASSWORD | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| POSTGRES_DATABASE | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| RESEND_API_KEY | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| VERCEL_API_TOKEN | ✅ Set | ⚠️ Perlu update | Update di Vercel |
| DOMAIN_NAME | ✅ Set | ⚠️ Perlu update | Update di Vercel |

---

## 🔍 Cara Verifikasi Database Connection:

### Local Development:
```bash
# Test database connection
bun run db:push

# Check if data exists
bun run db:studio
```

### Production (Vercel):
1. Buka Vercel Dashboard → Deployments
2. Cek deployment terbaru
3. Jika error, lihat log untuk database connection error

---

## 🐛 Troubleshooting:

### Issue 1: Database Connection Error
**Error:** `Connection timeout` atau `Connection refused`

**Solusi:**
1. Pastikan DATABASE_URL benar
2. Pastikan Neon database masih aktif
3. Cek network/firewall settings
4. Gunakan `POSTGRES_PRISMA_URL` yang sudah include `connect_timeout=15`

### Issue 2: Prisma Migration Error
**Error:** `P3006` atau migration conflict

**Solusi:**
```bash
# Reset Prisma (HATI-HATI: akan menghapus data!)
bun run db:reset

# Atau push schema saja
bun run db:push
```

### Issue 3: Environment Variables Tidak Terbaca di Production
**Solusi:**
1. Pastikan nama environment variable benar (case-sensitive)
2. Pastikan value tidak ada spasi ekstra
3. Redeploy setelah menambahkan environment variables

---

## ✅ Checklist:

### Local Development:
- [x] DATABASE_URL diupdate di `.env`
- [x] Semua Neon parameters ditambahkan
- [x] Environment variables lain sudah ada

### Production (Vercel):
- [ ] DATABASE_URL diupdate di Vercel
- [ ] DATABASE_URL_UNPOOLED diupdate di Vercel
- [ ] POSTGRES_PRISMA_URL diupdate di Vercel
- [ ] POSTGRES_URL, USER, HOST, PASSWORD, DATABASE diupdate di Vercel
- [ ] RESEND_API_KEY diupdate di Vercel
- [ ] VERCEL_API_TOKEN diupdate di Vercel
- [ ] DOMAIN_NAME diupdate di Vercel
- [ ] Redeploy setelah update

---

## 🎯 Langkah Selanjutnya:

1. **Buka Vercel Dashboard** → Settings → Environment Variables
2. **Tambahkan/Update semua variables** yang terdaftar di atas
3. **Save** semua changes
4. **Redeploy** project
5. **Test** semua fitur setelah deploy selesai

---

**Database configuration berhasil diupdate! 🚀**

Silakan update environment variables di Vercel dan redeploy untuk mengaktifkan perubahan.
