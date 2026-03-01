import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Hash password function - HARUS SAMA PERSIS dengan login & register
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, testPassword } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username wajib diisi' }, { status: 400 })
    }

    console.log('[Debug Password] Request for:', { username, hasTestPassword: !!testPassword })

    // Find user
    const user = await db.user.findUnique({
      where: { username }
    })

    if (!user) {
      console.log('[Debug Password] User not found:', username)
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Check password format
    const isHashed = user.password.length === 64 && /^[0-9a-f]{64}$/.test(user.password)

    // If testPassword provided, test it
    let testResult = null
    if (testPassword) {
      const hashedTest = hashPassword(testPassword)
      testResult = {
        testPassword: testPassword.substring(0, 5) + '...',
        testPasswordHash: hashedTest.substring(0, 10) + '...',
        storedPasswordHash: user.password.substring(0, 10) + '...',
        match: hashedTest === user.password
      }
    }

    console.log('[Debug Password] User found:', {
      id: user.id,
      username: user.username,
      role: user.role,
      isHashed,
      passwordLength: user.password.length,
      passwordPrefix: user.password.substring(0, 10) + '...'
    })

    if (testResult) {
      console.log('[Debug Password] Test result:', {
        match: testResult.match,
        testHashPrefix: testResult.testPasswordHash,
        storedHashPrefix: testResult.storedPasswordHash
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      passwordInfo: {
        isHashed,
        passwordLength: user.password.length,
        passwordPrefix: user.password.substring(0, 10) + '...',
        isPlainText: !isHashed
      },
      testResult
    })
  } catch (error) {
    console.error('[Debug Password] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
