import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PanelIndexPage() {
  const session = await auth();
  if (!session) redirect("/giris");

  if (session.user.role === "ADMIN") redirect("/panel/admin");
  redirect(session.user.role === "CONTRACTOR" ? "/panel/muteahhit" : "/panel/ev-sahibi");
}
