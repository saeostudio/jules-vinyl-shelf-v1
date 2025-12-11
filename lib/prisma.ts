import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// In Prisma 7, we might need to pass the adapter or url explicitly if using the new config system
// BUT, for standard usage, standard PrismaClient() should work if generated correctly.
// The error says: "PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions"
// This implies the 0-argument constructor is failing or deprecated in this specific setup?
// Let's try passing the datasource url explicitly.

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
