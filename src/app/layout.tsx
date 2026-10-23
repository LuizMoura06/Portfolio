import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Luiz Moura | Software Engineering Portfolio";
const description = "Portfólio de Luiz Moura, estudante de Engenharia de Software na PUC Minas. Projetos, experiências e interesse em desenvolvimento web e suporte técnico.";
export const metadata: Metadata = {
  title, description,
  authors: [{ name: "Luiz Gustavo Moura e Souza" }],
  keywords: ["Luiz Moura", "Engenharia de Software", "PUC Minas", "DIAW", "portfólio", "Voluntarize"],
  ...(process.env.SITE_URL ? { metadataBase: new URL(process.env.SITE_URL) } : {}),
  openGraph: { title, description, type: "website", locale: "pt_BR", alternateLocale: "en_US", siteName: "Luiz Moura" },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#10120f", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
