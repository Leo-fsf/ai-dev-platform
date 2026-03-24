import type { Metadata } from 'next'
import './globals.css'

export const metadata = {
  title: 'AI Dev Platform - AI全栈开发工作流平台',
  description: '用自然语言构建应用和网站 - 全栈AI开发工作流',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
