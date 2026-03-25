import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AgentPage from '../src/app/agent/page'

describe('AgentPage', () => {
  it('renders the agent title', () => {
    render(<AgentPage />)
    const title = screen.getByText('🤖 AI Agent 智能助手')
    expect(title).toBeInTheDocument()
  })

  it('renders the quick templates section', () => {
    render(<AgentPage />)
    const quickTemplates = screen.getByText('💡 快捷问题')
    expect(quickTemplates).toBeInTheDocument()
  })

  it('renders all 4 categories', () => {
    render(<AgentPage />)
    expect(screen.getByText('代码编写')).toBeInTheDocument()
    expect(screen.getByText('代码调试')).toBeInTheDocument()
    expect(screen.getByText('架构设计')).toBeInTheDocument()
    expect(screen.getByText('学习辅导')).toBeInTheDocument()
  })

  it('renders 12 template buttons', () => {
    render(<AgentPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(10)
  })

  it('sends a message when template button is clicked', async () => {
    render(<AgentPage />)
    const templateButton = screen.getByText('生成React组件')
    
    fireEvent.click(templateButton)
    
    await waitFor(() => {
      const userMessage = screen.getByText('帮我生成一个React按钮组件，包含点击事件')
      expect(userMessage).toBeInTheDocument()
    })
  })

  it('displays assistant response after sending message', async () => {
    render(<AgentPage />)
    const templateButton = screen.getByText('生成React组件')
    
    fireEvent.click(templateButton)
    
    await waitFor(() => {
      const response = screen.getByText(/以下是React按钮组件的代码/)
      expect(response).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('allows typing in input field', () => {
    render(<AgentPage />)
    const input = screen.getByPlaceholderText('输入你的问题...')
    
    fireEvent.change(input, { target: { value: '如何使用React Hooks' } })
    
    expect(input).toHaveValue('如何使用React Hooks')
  })

  it('sends custom message when send button is clicked', async () => {
    render(<AgentPage />)
    const input = screen.getByPlaceholderText('输入你的问题...')
    const sendButton = screen.getByText('发送')
    
    fireEvent.change(input, { target: { value: '测试消息' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      const userMessage = screen.getByText('测试消息')
      expect(userMessage).toBeInTheDocument()
    })
  })

  it('displays loading indicator while waiting for response', async () => {
    render(<AgentPage />)
    const templateButton = screen.getByText('生成React组件')
    
    fireEvent.click(templateButton)
    
    await waitFor(() => {
      const loadingIndicator = screen.getByRole('button', { name: /发送/i })
      expect(loadingIndicator).toBeDisabled()
    })
  })

  it('displays timestamps on messages', () => {
    render(<AgentPage />)
    const templateButton = screen.getByText('生成React组件')
    
    fireEvent.click(templateButton)
    
    const timestamps = screen.getAllByText(/\d{2}:\d{2}/)
    expect(timestamps.length).toBeGreaterThan(0)
  })
})