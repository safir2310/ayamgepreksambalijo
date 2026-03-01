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

    console.log('[Login API] Received request:', { username, role, hasPassword: !!password })

    if (!username || !password) {
      console.log('[Login API] Missing username or password')
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    // Hash the input password
    const hashedPassword = hashPassword(password)
    console.log('[Login API] Password hashed:', hashedPassword.substring(0, 10) + '...')

    // Find user by username
    const user = await db.user.findUnique({
      where: { username }
    })

    console.log('[Login API] User found:', !!user)

    if (!user) {
      console.log('[Login API] User not found:', username)
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    console.log('[Login API] User details:', {
      id: user.id,
      username: user.username,
      role: user.role,
      hasPassword: !!user.password,
      storedPasswordPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none'
    })

    // Check if role matches
    if (user.role !== role) {
      console.log('[Login API] Role mismatch:', { userRole: user.role, requestRole: role })
      return NextResponse.json({ error: 'Role tidak sesuai' }, { status: 401 })
    }

    // Compare hashed passwords
    if (user.password !== hashedPassword) {
      console.log('[Login API] Password mismatch:', {
        inputHash: hashedPassword.substring(0, 10) + '...',
        storedHash: user.password.substring(0, 10) + '...',
        match: user.password === hashedPassword
      })
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    console.log('[Login API] Login successful:', { username, role })

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
    console.error('[Login API] Error:', error)
    console.error('[Login API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
