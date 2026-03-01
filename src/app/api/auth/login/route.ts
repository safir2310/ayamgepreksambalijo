import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Hash password function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    console.log('[Login] Attempting login:', { username, role })

    // Find user by username
    const user = await db.user.findUnique({
      where: { username }
    })

    if (!user) {
      console.log('[Login] User not found:', username)
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    // Check if role matches
    if (user.role !== role) {
      console.log('[Login] Role mismatch:', { userRole: user.role, requestRole: role })
      return NextResponse.json({ error: 'Role tidak sesuai' }, { status: 401 })
    }

    // Hash the password and compare
    const hashedPassword = hashPassword(password)

    if (user.password !== hashedPassword) {
      console.log('[Login] Password mismatch for user:', username)
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    console.log('[Login] Login successful:', { username, role })

    // Generate simple token
    const token = crypto.randomBytes(32).toString('hex')

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        points: user.points
      },
      token
    })
  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
