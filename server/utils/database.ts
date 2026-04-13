import { PrismaClient } from '@prisma/client'
import { DataManager } from './datamanager'

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Any variable that needs to be passed to every
// route will go inside this class
export class Client {
    prisma: PrismaClient
    manager: typeof DataManager
    constructor() {
        this.prisma = prisma
        this.manager = DataManager
    }
}
