import { readDb } from "../../../lib/data";

export async function GET() {
  const db = await readDb();
  const approvedSubmissions = db.submissions.filter((s) => s.status === "approved");
  const avgRating = approvedSubmissions.length
    ? approvedSubmissions.reduce((sum, s) => sum + Number(s.rating || 0), 0) / approvedSubmissions.length
    : 0;

  return Response.json({
    settings: db.settings,
    agenda: db.agenda.sort((a, b) => a.order - b.order),
    speakers: db.speakers,
    sponsors: db.sponsors,
    approvedSubmissions,
    avgRating,
  });
}
