'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export default function AutoLogin() {
  const { setUser } = useAppStore()

  useEffect(() => {
    // 检查localStorage中是否有用户信息
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          setUser(user)
        } catch (error) {
          console.error('解析用户信息失败:', error)
          localStorage.removeItem('user')
        }
      }
    }
  }, [setUser])

  return null
}
