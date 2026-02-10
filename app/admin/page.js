import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "../../lib/auth";
import AdminClient from "../components/AdminClient";

export default function AdminPage() {
  const token = cookies().get("admin_token")?.value;
  const valid = verifyToken(token);
  if (!valid) redirect("/admin/login");

  return <AdminClient />;
}
