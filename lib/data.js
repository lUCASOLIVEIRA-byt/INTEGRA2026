import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function readDb() {
  const raw = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function updateDb(mutator) {
  const db = await readDb();
  const updated = await mutator(db);
  await writeDb(updated || db);
  return updated || db;
}
