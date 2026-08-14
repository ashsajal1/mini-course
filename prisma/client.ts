import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

import ws from "ws";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

// Polyfill global for environments where it's not defined
const g = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = g.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") g.prisma = prisma;

export default prisma;
