// 简化的 persist 中间件

import { createJSONStorage } from 'zustand/middleware'

const storage = typeof window !== 'undefined'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => {
      const fs = require('fs')
      const path = require('path')
      const os = require('os')
      const dir = '/workspace/projects/workspace/ai-dev-platform/data/store'
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      return {
        getItem: (name) => {
          const file = path.join(dir, `${name}.json`)
          try {
            const content = fs.readFileSync(file, 'utf-8')
            return JSON.parse(content)
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          const file = path.join(dir, `${name}.json`)
          fs.writeFileSync(file, JSON.stringify(value, null, 2))
        },
        removeItem: (name) => {
          const file = path.join(dir, `${name}.json`)
          if (fs.existsSync(file)) {
            fs.unlinkSync(file)
          }
        }
      }
    })

export function persist(config?: any) {
  return config ?? {}
}