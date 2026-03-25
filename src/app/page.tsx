'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

export default function Page() {
  const [code, setCode] = useState('')
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{t.homeTitle}</h1>
          <p className="text-gray-600 mt-2">{t.homeDescription}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.homeInputPlaceholder}
            className="w-full h-40 border rounded-lg p-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setCode('<button class="px-4 py-2 bg-blue-500 text-white rounded">生成</button>')
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {t.generateCode}
            </button>
          </div>
          
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto max-h-96 mt-4">
            <code>{code || t.waiting}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}