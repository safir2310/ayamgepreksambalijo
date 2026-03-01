import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Hash password function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Cek apakah password adalah SHA-256 hash
function isHashedPassword(password: string): boolean {
  return password && password.length === 64 && /^[0-9a-f]{64}$/.test(password)
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

    const isStoredHashed = isHashedPassword(user.password)
    console.log('[Login API] User details:', {
      id: user.id,
      username: user.username,
      role: user.role,
      hasPassword: !!user.password,
      isStoredHashed,
      storedPasswordPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none',
      storedPasswordLength: user.password?.length
    })

    // Check if role matches
    if (user.role !== role) {
      console.log('[Login API] Role mismatch:', { userRole: user.role, requestRole: role })
      return NextResponse.json({ error: 'Role tidak sesuai' }, { status: 401 })
    }

    // Check password - support both plain text (old users) and hashed (new users)
    let passwordMatch = false

    if (isStoredHashed) {
      // Password already hashed, compare with hash
      passwordMatch = user.password === hashedPassword
      console.log('[Login API] Comparing hashed passwords:', {
        inputHash: hashedPassword.substring(0, 10) + '...',
        storedHash: user.password.substring(0, 10) + '...',
        match: passwordMatch
      })
    } else {
      // Password is plain text, compare directly OR with hash (for transition)
      passwordMatch = user.password === password || user.password === hashedPassword
      console.log('[Login API] Comparing plain text:', {
        inputPassword: password,
        storedPassword: user.password,
        inputHash: hashedPassword.substring(0, 10) + '...',
        directMatch: user.password === password,
        hashMatch: user.password === hashedPassword,
        finalMatch: passwordMatch
      })

      // Auto-update to hashed format for security
      if (user.password === password && user.password !== hashedPassword) {
        console.log('[Login API] Converting plain text password to hash...')
        await db.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
        console.log('[Login API] Password converted to hash')
      }
    }

    if (!passwordMatch) {
      console.log('[Login API] Password mismatch')
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    console.log('[Login API] Login successful:', { username, role, isStoredHashed })

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
