import { readDb, writeDb } from "../../../../lib/data";

export async function POST(req) {
  const { id, direction } = await req.json();
  const db = await readDb();
  const list = [...db.agenda].sort((a, b) => a.order - b.order);
  const idx = list.findIndex((a) => a.id === id);
  const newIndex = direction === "up" ? idx - 1 : idx + 1;
  if (idx >= 0 && newIndex >= 0 && newIndex < list.length) {
    [list[idx], list[newIndex]] = [list[newIndex], list[idx]];
  }
  db.agenda = list.map((item, index) => ({ ...item, order: index + 1 }));
  await writeDb(db);
  return Response.json({ ok: true });
}
