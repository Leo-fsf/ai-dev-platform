import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { chatWithAI } from '@/lib/openai'
import { getUserById, validateSession } from '@/lib/auth'

const MAX_MESSAGES = 50 // P0-9: 限制最大消息数量

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') as string
    const token = request.cookies.get('auth-token')?.value
    const { messages, conversationId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // P0-2: 在 API 中验证Session
    if (token) {
      const isValidSession = await validateSession(userId, token)
      if (!isValidSession) {
        return NextResponse.json(
          { error: '会话已过期，请重新登录' },
          { status: 401 }
        )
      }
    }

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 调用OpenAI API
    const assistantMessage = await chatWithAI(messages)

    // 保存对话
    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
      })

      if (conversation) {
        // P0-8: 添加JSON解析异常处理
        let existingMessages: any[] = []
        try {
          existingMessages = JSON.parse(conversation.messages)
        } catch (error) {
          console.error('JSON解析失败:', error)
          existingMessages = []
        }

        // P0-9: 限制消息数量，裁剪旧消息
        const newMessages = [
          ...existingMessages,
          ...messages,
          { role: 'assistant', content: assistantMessage }
        ]

        const limitedMessages = newMessages.slice(-MAX_MESSAGES)

        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            messages: JSON.stringify(limitedMessages),
            updatedAt: new Date()
          }
        })
      }
    } else {
      // 创建新对话
      await prisma.conversation.create({
        data: {
          userId,
          title: messages[messages.length - 1]?.content?.substring(0, 50) || '新对话',
          messages: JSON.stringify([
            ...messages,
            { role: 'assistant', content: assistantMessage }
          ])
        }
      })
    }

    return NextResponse.json({
      response: assistantMessage,
      conversationId
    })
  } catch (error) {
    console.error('对话API错误:', error)
    return NextResponse.json(
      { error: '对话服务暂时不可用' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') as string
    const token = request.cookies.get('auth-token')?.value

    if (!userId) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // P0-2: 验证Session
    if (token) {
      const isValidSession = await validateSession(userId, token)
      if (!isValidSession) {
        return NextResponse.json(
          { error: '会话已过期，请重新登录' },
          { status: 401 }
        )
      }
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      conversations: conversations.map((conv) => ({
        // P0-12: 修复类型问题，返回完整的 Conversation 对象
        id: conv.id,
        userId: conv.userId,
        title: conv.title,
        messages: (() => {
          try {
            return JSON.parse(conv.messages)
          } catch (error) {
            console.error('JSON解析失败:', error)
            return []
          }
        })(),
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      }))
    })
  } catch (error) {
    console.error('对话列表API错误:', error)
    return NextResponse.json(
      { error: '获取对话列表失败' },
      { status: 500 }
    )
  }
}
