import { PrismaClient } from "@prisma/client";

declare global {
  // we add this so TS knows about the variable and
  // so we don’t recreate a client on every hot‑reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}