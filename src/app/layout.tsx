import { LanguageProvider } from '@/lib/i18n/context'
import { ToastProvider } from '@/components/Toast'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import GlobalSearch from '@/components/GlobalSearch'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI Dev Platform - 全栈开发工作流平台</title>
        <meta name="description" content="用自然语言生成代码，支持多格式多版本，一键部署" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <GlobalSearch />
              <Navbar />
              {children}
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}