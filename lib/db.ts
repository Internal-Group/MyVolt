import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString,  });
const prisma = new PrismaClient({
  adapter,
  log: [
    { level: "query", emit: "event" },
    { level: "info", emit: "stdout" },
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
  ],
});

prisma.$on("query", (e: { params: string | any[]; query: any; duration: any; }) => {
  const params = e.params.length > 64 ? `${e.params.slice(0, 64)}…` : e.params;
  console.log(`  │  Query: ${e.query}`);
  console.log(`  │  Params: ${params}  ${e.duration}ms`);
});

export { prisma };