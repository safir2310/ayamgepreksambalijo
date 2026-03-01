import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Hash password function (SAMA dengan yang ada di login & register)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Cek apakah string adalah SHA-256 hash (64 karakter hex)
function isHashed(password: string): boolean {
  if (!password || password.length !== 64) return false
  // SHA-256 menghasilkan 64 karakter hex (0-9, a-f)
  return /^[0-9a-f]{64}$/.test(password)
}

export async function POST(request: NextRequest) {
  try {
    // Get all users
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        role: true
      }
    })

    console.log('[Fix Passwords] Total users:', allUsers.length)

    let fixedCount = 0
    let alreadyHashedCount = 0
    const results = []

    for (const user of allUsers) {
      const isHash = isHashed(user.password)

      console.log(`[Fix Passwords] User: ${user.username}, Role: ${user.role}, Is Hashed: ${isHash}`)

      if (!isHash) {
        // Password masih plain text, konversi ke hash
        const hashedPassword = hashPassword(user.password)

        const updatedUser = await db.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword
          }
        })

        console.log(`[Fix Passwords] Fixed password for: ${user.username}`)
        console.log(`[Fix Passwords] Old password (plain): ${user.password}`)
        console.log(`[Fix Passwords] New password (hash): ${hashedPassword.substring(0, 10)}...`)

        results.push({
          username: user.username,
          role: user.role,
          action: 'hashed',
          oldPasswordPrefix: user.password.substring(0, 10) + '...',
          newPasswordPrefix: hashedPassword.substring(0, 10) + '...'
        })

        fixedCount++
      } else {
        console.log(`[Fix Passwords] Already hashed: ${user.username}`)
        results.push({
          username: user.username,
          role: user.role,
          action: 'already_hashed',
          passwordPrefix: user.password.substring(0, 10) + '...'
        })
        alreadyHashedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Password check completed',
      totalUsers: allUsers.length,
      fixedCount,
      alreadyHashedCount,
      results
    })
  } catch (error) {
    console.error('[Fix Passwords] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
