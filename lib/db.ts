import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString,  });

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "production"
      ? [
          { level: "warn", emit: "stdout" },
          { level: "error", emit: "stdout" },
        ]
      : [
          { level: "query", emit: "event" },
          { level: "info", emit: "stdout" },
          { level: "warn", emit: "stdout" },
          { level: "error", emit: "stdout" },
        ],
});

if (process.env.NODE_ENV !== "production") {
  prisma.$on("query", (e) => {
    const params =
      e.params.length > 64 ? `${e.params.slice(0, 64)}â€¦` : e.params;
    console.log(`  │  Query: ${e.query}`);
    console.log(`  │  Params: ${params}  ${e.duration}ms`);
  });
}

export { prisma };