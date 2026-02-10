import { readDb, writeDb } from "../../../lib/data";

export async function GET() {
  const db = await readDb();
  return Response.json({ submissions: db.submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
}

export async function PATCH(req) {
  const { id, status } = await req.json();
  const db = await readDb();
  db.submissions = db.submissions.map((s) => (s.id === id ? { ...s, status } : s));
  await writeDb(db);
  return Response.json({ ok: true });
}
