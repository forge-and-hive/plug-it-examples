import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'

// Determine the database path in a way that's compatible with different environments
let dbPath: string;

// Check if we're running in a astro 
if (import.meta.url) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dbPath = path.resolve(__dirname, '../../prisma/dev.db');
} else {
  // Fallback to a relative path to this package
  dbPath = path.resolve(process.cwd(), './prisma/dev.db');
}

// Initialize Prisma with explicit path to database
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
})
