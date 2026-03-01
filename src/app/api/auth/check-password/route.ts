import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function isHashed(password: string): boolean {
  if (!password || password.length !== 64) return false
  return /^[0-9a-f]{64}$/.test(password)
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username wajib diisi' }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    const isHash = isHashed(user.password)
    const passwordHash = hashPassword(password || '')
    const passwordMatch = password ? user.password === passwordHash : null

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      passwordStatus: {
        isHashed,
        passwordPrefix: user.password.substring(0, 10) + '...',
        passwordLength: user.password.length
      },
      checkResult: password ? {
        passwordMatch,
        inputHashPrefix: passwordHash.substring(0, 10) + '...'
      } : null
    })
  } catch (error) {
    console.error('[Check Password] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
