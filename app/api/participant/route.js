import { v4 as uuidv4 } from "uuid";
import { readDb, writeDb } from "../../../lib/data";

export async function POST(req) {
  const payload = await req.json();
  const db = await readDb();
  db.submissions.push({
    id: uuidv4(),
    nickname: payload.nickname,
    comment: payload.comment,
    rating: payload.rating,
    photoUrl: payload.photoUrl || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  await writeDb(db);
  return Response.json({ ok: true });
}
