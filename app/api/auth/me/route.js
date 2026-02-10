import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/auth";

export async function GET() {
  const token = cookies().get("admin_token")?.value;
  const user = verifyToken(token);
  return Response.json({ authenticated: !!user, user: user?.username || null });
}
