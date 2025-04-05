import { config } from 'dotenv'

config()

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const LANGCHAIN_API_KEY = process.env.LANGCHAIN_API_KEY
export const LANGCHAIN_TRACING_V2 = process.env.LANGCHAIN_TRACING_V2
export const LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT