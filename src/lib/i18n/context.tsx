'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { zh } from './zh'
import { en } from './en'

export type Language = 'zh' | 'en'
export type Translations = typeof zh

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
  zh,
  en
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh')

  // 从localStorage读取保存的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // 保存语言设置到localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'zh' ? 'en' : 'zh')
    localStorage.setItem('language', language === 'zh' ? 'en' : 'zh')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}