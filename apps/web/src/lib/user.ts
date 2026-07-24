import bcrypt from "bcryptjs";
import { prisma } from "@donusum-kapisi/db";
import type { SignUpInput } from "@donusum-kapisi/shared";

export class UserAlreadyExistsError extends Error {}

export async function createUser({ name, email, password, role }: SignUpInput) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new UserAlreadyExistsError();
  }

  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({ data: { name, email, passwordHash, role } });
}
