import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('[Cashier Order] Database client check:', {
      dbExists: !!db,
      dbType: typeof db,
      hasOrder: !!(db as any).order,
      hasProduct: !!(db as any).product,
      hasUser: !!(db as any).user,
      hasPointHistory: !!(db as any).pointHistory
    })

    if (!db) {
      console.error('[Cashier Order] Database client is undefined!')
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      )
    }

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
      cashChange,
      shiftId
    } = body

    console.log('[Cashier Order] Received data:', { userId, userName, itemCount: items?.length, total, shiftId })

    // Validate required fields
    if (!userId || !items || items.length === 0 || !total) {
      console.error('[Cashier Order] Validation failed:', { userId, hasItems: !!items, itemCount: items?.length, total })
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
        console.error('[Cashier Order] Product not found:', item.productId)
        return NextResponse.json(
          { error: `Produk dengan ID ${item.productId} tidak ditemukan` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        console.error('[Cashier Order] Insufficient stock:', product.name, product.stock, item.quantity)
        return NextResponse.json(
          { error: `Stok ${product.name} tidak cukup. Sisa stok: ${product.stock}` },
          { status: 400 }
        )
      }
    }

    console.log('[Cashier Order] Stock validation passed, creating order...')

    let createdOrder: any = null

    try {
      // Create order and update stock in transaction
      createdOrder = await db.$transaction(async (tx) => {
        console.log('[Cashier Order] Transaction started')

        // Validate tx has required models
        if (!tx.order || !tx.product || !tx.user) {
          console.error('[Cashier Order] Transaction missing required models:', {
            hasOrder: !!tx.order,
            hasProduct: !!tx.product,
            hasUser: !!tx.user
          })
          throw new Error('Database transaction error: missing models')
        }

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
          isCashierOrder: true,
          shiftId: shiftId || null
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

      console.log('[Cashier Order] Order created:', newOrder.id)

      // Update stock for each product
      for (const item of items) {
        const updated = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
        console.log('[Cashier Order] Stock updated:', item.productId, 'new stock:', updated.stock)
      }

      // Calculate points (1 point per 1,000 Rupiah spent)
      pointsEarned = Math.floor(total / 1000)
      console.log('[Cashier Order] Points earned:', pointsEarned)

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

        console.log('[Cashier Order] User points updated')
      }

      // Create points history
      if (pointsEarned > 0) {
        await tx.pointHistory.create({
          data: {
            userId,
            orderId: newOrder.id,
            points: pointsEarned,
            type: 'earned',
            description: `Pesanan kasir - ${items.length} item`
          }
        })
        console.log('[Cashier Order] Points history created')
      }

      // Fetch updated user to get current points
      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { points: true }
      })

      return { ...newOrder, userPoints: updatedUser?.points || 0 }
    })

    console.log('[Cashier Order] Transaction completed successfully')
    } catch (transactionError) {
      console.error('[Cashier Order] Transaction error:', transactionError)
      throw transactionError
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
      pointsEarned,
      userPoints: createdOrder.userPoints,
      message: 'Pesanan berhasil dibuat'
    })
  } catch (error) {
    console.error('[Cashier Order] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Gagal membuat pesanan'
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
}
