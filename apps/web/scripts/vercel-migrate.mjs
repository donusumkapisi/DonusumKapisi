/**
 * Vercel build: DATABASE_URL yoksa migrate'i atla (generate zaten yapıldı).
 * Production'da DATABASE_URL zorunlu — migrate çalışır.
 */
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL?.trim()) {
  console.warn(
    "[vercel-migrate] DATABASE_URL yok — prisma migrate deploy atlandı. Vercel → Settings → Environment Variables ekleyin."
  );
  process.exit(0);
}

const result = spawnSync(
  "pnpm",
  ["--filter", "@donusum-kapisi/db", "exec", "prisma", "migrate", "deploy"],
  { stdio: "inherit", shell: true }
);

process.exit(result.status ?? 1);
