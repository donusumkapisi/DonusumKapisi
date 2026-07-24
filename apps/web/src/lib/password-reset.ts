import { randomInt, createHash } from "node:crypto";
import { prisma } from "@donusum-kapisi/db";

const CODE_TTL_MS = 30 * 60 * 1000;

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function createPasswordResetCode(email: string) {
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashCode(code),
      expires: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  return code;
}

export async function consumePasswordResetCode(email: string, code: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: hashCode(code) } },
  });

  if (!record || record.expires < new Date()) {
    return false;
  }

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: hashCode(code) } },
  });

  return true;
}
