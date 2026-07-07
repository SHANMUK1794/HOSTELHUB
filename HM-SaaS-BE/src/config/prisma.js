import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let _prisma = null;

function getPrisma() {
  if (!_prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    _prisma = new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });
  }
  return _prisma;
}

const prisma = new Proxy({}, {
  get(_, prop) {
    return getPrisma()[prop];
  }
});

export default prisma;

