import { neon } from '@neondatabase/serverless';

// Create a serverless SQL query client using Neon's HTTP driver
export const sql = neon(process.env.DATABASE_URL || '');
