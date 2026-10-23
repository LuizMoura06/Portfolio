import type { Localized } from "./projects";
type Experience = { company: string; role: Localized; period: Localized; description: Localized; };
export const experiences: Experience[] = [
  {
    company: "Hotel Vitória", role: { pt: "Recepcionista", en: "Receptionist" },
    period: { pt: "Jan 2025 — Fev 2026", en: "Jan 2025 — Feb 2026" },
    description: { pt: "Atendimento a hóspedes, orientação, suporte e rotinas de recepção. Uma experiência de escuta, comunicação e resolução de problemas no dia a dia.", en: "Guest service, guidance, support and reception routines. Everyday experience in listening, communication and problem solving." },
  },
  {
    company: "Farmácia Inova", role: { pt: "Atendente / Auxiliar de Loja", en: "Customer Service / Store Assistant" },
    period: { pt: "Jan 2025 — Fev 2026", en: "Jan 2025 — Feb 2026" },
    description: { pt: "Atendimento ao público, organização e apoio às rotinas da loja, com atenção às necessidades de cada cliente.", en: "Customer service, organization and support for daily store routines, with attention to each customer's needs." },
  },
  {
    company: "Bob Duas Rodas", role: { pt: "Atendente / Auxiliar de Loja", en: "Customer Service / Store Assistant" },
    period: { pt: "Jun 2026 — Jul 2026", en: "Jun 2026 — Jul 2026" },
    description: { pt: "Atendimento ao cliente, organização de produtos e apoio operacional nas atividades da loja.", en: "Customer service, product organization and operational support for store activities." },
  },
];
