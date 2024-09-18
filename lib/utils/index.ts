import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createOpenAI } from '@ai-sdk/openai'
import { CoreMessage } from 'ai'

/**
 * Combines multiple class names into a single string with proper merging.
 * Utilizes `clsx` for conditional classNames and `twMerge` for Tailwind-specific merging.
 *
 * @param inputs - An array of class name values.
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Configures and returns an OpenAI chat model instance via a proxy URL.
 *
 * @param useSubModel - Optional boolean to determine if a sub-model should be used.
 * @returns An instance of the OpenAI chat model.
 * @throws Will throw an error if required environment variables are missing.
 */
export function getModel(useSubModel = false) {
  const openaiApiBase = process.env.OPENAI_API_BASE
  const openaiApiKey = process.env.OPENAI_API_KEY
  const openaiApiModel = process.env.OPENAI_API_MODEL || 'gpt-4o'

  // Validate required environment variables for OpenAI
  if (!openaiApiBase || !openaiApiKey) {
    throw new Error(
      'Missing environment variables for OpenAI. Ensure OPENAI_API_BASE and OPENAI_API_KEY are set.'
    )
  }

  // Initialize the OpenAI instance with proxy settings
  const openai = createOpenAI({
    baseURL: openaiApiBase, // Proxy URL for OpenAI API
    apiKey: openaiApiKey // OpenAI API Key
  })

  return openai.chat(openaiApiModel)
}

/**
 * Takes an array of AIMessage and modifies each message where the role is 'tool'.
 * Changes the role to 'assistant' and converts the content to a JSON string.
 * Returns the modified messages as an array of CoreMessage.
 *
 * @param messages - Array of CoreMessage objects.
 * @returns Array of modified CoreMessage objects.
 */
export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages.map(message =>
    message.role === 'tool'
      ? {
          ...message,
          role: 'assistant',
          content: JSON.stringify(message.content),
          type: 'tool'
        }
      : message
  ) as CoreMessage[]
}

/**
 * Sanitizes a URL by replacing spaces with '%20'.
 *
 * @param url - The URL to sanitize.
 * @returns The sanitized URL.
 */
export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, '%20')
}
