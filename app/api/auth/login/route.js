import { createToken } from "../../../../lib/auth";

export async function POST(req) {
  const { user, password } = await req.json();
  const validUser = process.env.ADMIN_USER || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "admin123";

  if (user !== validUser || password !== validPass) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const token = createToken(user);
  const res = Response.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
