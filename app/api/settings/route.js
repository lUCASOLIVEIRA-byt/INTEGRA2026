import { readDb, writeDb } from "../../../lib/data";

export async function GET() {
  const db = await readDb();
  return Response.json(db.settings);
}

export async function PUT(req) {
  const payload = await req.json();
  const db = await readDb();
  db.settings = { ...db.settings, ...payload };
  await writeDb(db);
  return Response.json({ ok: true, settings: db.settings });
}
