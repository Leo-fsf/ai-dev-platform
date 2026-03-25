import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HomePage from '../src/app/page'

describe('HomePage', () => {
  it('renders the page title', () => {
    render(<HomePage />)
    const title = screen.getByText('AI代码生成器')
    expect(title).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<HomePage />)
    const description = screen.getByText('用自然语言生成代码')
    expect(description).toBeInTheDocument()
  })

  it('renders the textarea', () => {
    render(<HomePage />)
    const textarea = screen.getByPlaceholderText('输入描述，例如：生成一个React按钮组件')
    expect(textarea).toBeInTheDocument()
  })

  it('renders the generate button', () => {
    render(<HomePage />)
    const button = screen.getByText('生成代码')
    expect(button).toBeInTheDocument()
  })

  it('generates code when button is clicked', async () => {
    render(<HomePage />)
    const button = screen.getByText('生成代码')
    
    fireEvent.click(button)
    
    await waitFor(() => {
      const codeBlock = screen.getByText('<button class="px-4 py-2 bg-blue-500')
      expect(codeBlock).toBeInTheDocument()
    })
  })

  it('updates textarea value when user types', () => {
    render(<HomePage />)
    const textarea = screen.getByPlaceholderText('输入描述，例如：生成一个React按钮组件')
    
    fireEvent.change(textarea, { target: { value: '生成一个登录表单' } })
    
    expect(textarea).toHaveValue('生成一个登录表单')
  })

  it('displays "等待生成..." when no code is generated', () => {
    render(<HomePage />)
    const waitingText = screen.getByText('等待生成...')
    expect(waitingText).toBeInTheDocument()
  })
})