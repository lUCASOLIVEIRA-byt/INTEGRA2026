import { v4 as uuidv4 } from "uuid";
import { readDb, writeDb } from "../../../lib/data";

export async function GET() {
  const db = await readDb();
  return Response.json(db.agenda.sort((a, b) => a.order - b.order));
}

export async function POST(req) {
  const payload = await req.json();
  const db = await readDb();
  const order = (db.agenda.at(-1)?.order || 0) + 1;
  db.agenda.push({ id: uuidv4(), ...payload, order });
  await writeDb(db);
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const id = new URL(req.url).searchParams.get("id");
  const db = await readDb();
  db.agenda = db.agenda.filter((item) => item.id !== id);
  db.agenda = db.agenda.map((item, idx) => ({ ...item, order: idx + 1 }));
  await writeDb(db);
  return Response.json({ ok: true });
}
