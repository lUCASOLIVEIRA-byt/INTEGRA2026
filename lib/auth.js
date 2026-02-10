import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "integra-2026-secret";

export function createToken(username) {
  const payload = JSON.stringify({ username, iat: Date.now() });
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}::${sig}`).toString("base64url");
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [payload, sig] = decoded.split("::");
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expected) return null;
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
