import "./globals.css";

export const metadata = {
  title: "INTEGRA 2026 | Evento Institucional",
  description: "Site oficial com agenda, palestrantes, patrocinadores e participação interativa.",
  keywords: ["evento", "institucional", "agenda", "palestrantes"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
