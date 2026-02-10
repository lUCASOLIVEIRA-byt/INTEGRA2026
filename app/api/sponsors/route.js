import { v4 as uuidv4 } from "uuid";
import { readDb, writeDb } from "../../../lib/data";

export async function POST(req) {
  const payload = await req.json();
  const db = await readDb();
  db.sponsors.push({ id: uuidv4(), ...payload });
  await writeDb(db);
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const id = new URL(req.url).searchParams.get("id");
  const db = await readDb();
  db.sponsors = db.sponsors.filter((item) => item.id !== id);
  await writeDb(db);
  return Response.json({ ok: true });
}
