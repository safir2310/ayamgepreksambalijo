import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Hash password function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    console.log('[Reset Password] Request for user:', username)

    // Find user
    const user = await db.user.findUnique({
      where: { username }
    })

    if (!user) {
      console.log('[Reset Password] User not found:', username)
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    console.log('[Reset Password] User found:', {
      id: user.id,
      username: user.username,
      role: user.role,
      hasOldPassword: !!user.password,
      oldPasswordPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none'
    })

    // Hash the new password
    const hashedPassword = hashPassword(password)
    console.log('[Reset Password] New password hashed:', hashedPassword.substring(0, 10) + '...')

    // Update password
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })

    console.log('[Reset Password] Password updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Password berhasil direset',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('[Reset Password] Error:', error)
    console.error('[Reset Password] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
