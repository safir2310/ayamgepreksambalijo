import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POS Transactions API - Updated
// GET - Mendapatkan semua transaksi
export async function GET() {
  try {
    const transactions = await prisma.pOSTransaction.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data transaksi' },
      { status: 500 }
    )
  }
}

// POST - Membuat transaksi baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, total } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Data item tidak valid' },
        { status: 400 }
      )
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Total tidak valid' },
        { status: 400 }
      )
    }

    // Buat transaksi baru
    const transaction = await prisma.pOSTransaction.create({
      data: {
        total: total,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Gagal membuat transaksi' },
      { status: 500 }
    )
  }
}
