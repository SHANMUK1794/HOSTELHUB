import prisma from "./prisma.js";

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL Database connected successfully via Prisma");
  } catch (error) {
    console.error("PostgreSQL Database connection failed:", error);
    process.exit(1);
  }
};
