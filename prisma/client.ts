import "dotenv/config";
import { PrismaClient } from '@/generated/prisma';
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import dns from "node:dns";

import ws from "ws";

// This dev machine has no working IPv6 route to Neon; force the WebSocket
// connection to resolve over IPv4 so it doesn't time out on IPv6 first.
dns.setDefaultResultOrder("ipv4first");

class IPv4WebSocket extends ws {
  constructor(url: string, protocols?: string | string[], options?: ws.ClientOptions) {
    super(url, protocols as never, {
      ...(options ?? {}),
      lookup: (hostname: string, opts: never, cb: never) =>
        dns.lookup(hostname, { ...(opts as dns.LookupAllOptions), family: 4 }, cb as never),
    } as ws.ClientOptions);
  }
}

neonConfig.webSocketConstructor = IPv4WebSocket as never;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

// Polyfill global for environments where it's not defined
const g = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = g.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") g.prisma = prisma;

export default prisma;
