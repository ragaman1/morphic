'use client'

import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/app/actions'
import { UserMessage } from './user-message'
import { ArrowRight } from 'lucide-react'
import { useAppState } from '@/lib/utils/app-state'

export function FollowupPanel() {
  const [input, setInput] = useState('')
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const { submit } = useActions()
  const [, setMessages] = useUIState<typeof AI>()
  const { isGenerating, setIsGenerating } = useAppState()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isGenerating || input.trim().length === 0) return
    setIsGenerating(true)
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <UserMessage message={input} />
    }
    setInput('')
    const responseMessage = await submit(formData)
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      responseMessage
    ])
    setIsGenerating(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
      <div className="relative flex items-center w-full">
        <Textarea
          ref={inputRef}
          name="input"
          rows={1}
          tabIndex={0}
          placeholder="Ask a question..."
          spellCheck={false}
          value={input}
          className="resize-none w-full min-h-12 max-h-36 rounded-full bg-muted border border-input pl-4 pr-14 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={e => {
            setInput(e.target.value)
            setShowEmptyScreen(e.target.value.length === 0)
          }}
          onKeyDown={e => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              if (input.trim().length === 0) {
                e.preventDefault()
                return
              }
              e.preventDefault()
              const textarea = e.target as HTMLTextAreaElement
              textarea.form?.requestSubmit()
            }
          }}
          onFocus={() => setShowEmptyScreen(true)}
          onBlur={() => setShowEmptyScreen(false)}
        />
        <Button
          type="submit"
          size="icon"
          disabled={input.trim().length === 0 || isGenerating}
          variant="ghost"
          className="absolute right-2 bottom-2"
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </form>
  )
}
