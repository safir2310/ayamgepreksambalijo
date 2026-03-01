import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      userName,
      userPhone,
      userAddress,
      items,
      total,
      paymentMethod,
      cashReceived,
      cashChange
    } = body

    // Validate required fields
    if (!userId || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Check stock and calculate points
    let pointsEarned = 0
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Produk dengan ID ${item.productId} tidak ditemukan` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stok ${product.name} tidak cukup` },
          { status: 400 }
        )
      }
    }

    // Create order and update stock in transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          userName,
          userPhone,
          userAddress,
          total,
          status: 'completed', // Kasir orders are automatically completed
          pointsEarned: 0, // Will be calculated after order creation
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal
            }))
          },
          paymentMethod: paymentMethod || 'cash',
          cashReceived: cashReceived || 0,
          cashChange: cashChange || 0,
          isCashierOrder: true
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          },
          user: {
            select: {
              username: true
            }
          }
        }
      })

      // Update stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      // Calculate points (1 point per 10,000 Rupiah spent)
      pointsEarned = Math.floor(total / 10000)

      // Update user points
      if (pointsEarned > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: pointsEarned
            }
          }
        })

        // Update order points
        await tx.order.update({
          where: { id: newOrder.id },
          data: { pointsEarned }
        })
      }

      // Create points history
      if (pointsEarned > 0) {
        await tx.pointsHistory.create({
          data: {
            userId,
            orderId: newOrder.id,
            points: pointsEarned,
            type: 'earned',
            description: `Pesanan kasir - ${items.length} item`
          }
        })
      }

      return newOrder
    })

    return NextResponse.json({
      success: true,
      order,
      message: 'Pesanan berhasil dibuat'
    })
  } catch (error) {
    console.error('Cashier order error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat pesanan' },
      { status: 500 }
    )
  }
}
