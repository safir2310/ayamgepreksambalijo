import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Hash password function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, phone, dateOfBirth, verificationCode, role } = await request.json()

    if (!username || !password || !email || !phone) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 400 })
    }

    // For admin, verify date of birth matches verification code
    if (role === 'admin') {
      if (!dateOfBirth || !verificationCode) {
        return NextResponse.json({ error: 'Tanggal lahir dan kode verifikasi wajib diisi' }, { status: 400 })
      }

      // Format date of birth to match verification code (remove dashes)
      const dobCode = dateOfBirth.replace(/-/g, '')

      if (verificationCode !== dobCode) {
        return NextResponse.json({ error: 'Kode verifikasi tidak valid' }, { status: 400 })
      }
    }

    // Hash password before storing
    const hashedPassword = hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        phone,
        dateOfBirth: role === 'admin' ? dateOfBirth : null,
        role: role || 'user',
        points: 0
      }
    })

    console.log('[Register] User created:', { id: user.id, username, role })

    return NextResponse.json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    console.error('[Register] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
