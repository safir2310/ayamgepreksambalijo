import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Tutup Kasir (Hapus semua transaksi)
export async function POST(request: NextRequest) {
  try {
    // Hapus semua transaksi dan item terkait menggunakan cascade delete
    await prisma.pOSTransaction.deleteMany({})

    return NextResponse.json({
      success: true,
      message: 'Kasir berhasil ditutup. Semua data telah dihapus.'
    })
  } catch (error) {
    console.error('Error closing kasir:', error)
    return NextResponse.json(
      { error: 'Gagal menutup kasir' },
      { status: 500 }
    )
  }
}
