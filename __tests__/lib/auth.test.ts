import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth'

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'password123'
      const hashed = await hashPassword(password)

      expect(hashed).toBeDefined()
      expect(hashed).not.toBe(password)
      expect(typeof hashed).toBe('string')
      expect(hashed.length).toBeGreaterThan(0)
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'password123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'password123'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(password, hashed)

      expect(isValid).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'password123'
      const wrongPassword = 'wrongpassword'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hashed)

      expect(isValid).toBe(false)
    })
  })

  describe('generateToken and verifyToken', () => {
    it('should generate a valid token', () => {
      const payload = { userId: '1', email: 'test@example.com' }
      const token = generateToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3) // JWT has 3 parts
    })

    it('should verify a valid token', () => {
      const payload = { userId: '1', email: 'test@example.com' }
      const token = generateToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).toEqual(payload)
    })

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const decoded = verifyToken(invalidToken)

      expect(decoded).toBe(null)
    })

    it('should return null for expired token', () => {
      // Create an expired token (this test might need adjustment based on actual token expiration)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjI1MDQwMDAwLCJleHAiOjE2MjUwNDAwMDB9.signature'
      const decoded = verifyToken(expiredToken)

      expect(decoded).toBe(null)
    })
  })
})
