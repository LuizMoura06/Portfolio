export type Locale = "pt" | "en";
export type Localized = Record<Locale, string>;
export type Project = {
  id: string; name: string; startDate: string; period: Localized;
  category: Localized; description: Localized; contributions: Localized[];
  technologies: string[]; image: string; imageAlt: Localized;
  repository: string; evidence: { label: Localized; url: string }[];
};
const repository = "https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-equipe-voluntarize";
export const projects: Project[] = [{
  id: "voluntarize", name: "Voluntarize", startDate: "2026-01-01",
  period: { pt: "1º semestre · 2026", en: "1st semester · 2026" },
  category: { pt: "Projeto acadêmico · PUC Minas", en: "Academic project · PUC Minas" },
  description: {
    pt: "Tecnologia que aproxima quem quer ajudar de quem precisa. Uma aplicação web que conecta voluntários a ONGs e oportunidades de voluntariado, com busca de ações, perfis e conexões entre pessoas e organizações.",
    en: "Technology connecting people who want to help with those who need it. A web application bringing volunteers, NGOs and volunteering opportunities together through opportunity search, profiles and connections.",
  },
  contributions: [
    { pt: "Ajustes de layout e interações na visualização detalhada de voluntários.", en: "Layout and interaction improvements in detailed volunteer profiles." },
    { pt: "Implementação do sistema de seguidores entre ONGs e voluntários.", en: "Implementation of the following system between NGOs and volunteers." },
  ],
  technologies: ["HTML", "CSS", "JavaScript", "JSON Server", "Node.js"],
  image: "/images/voluntarize-voluntarios.png",
  imageAlt: { pt: "Tela real do Voluntarize mostrando o perfil detalhado de um voluntário", en: "Actual Voluntarize screen showing a detailed volunteer profile" },
  repository,
  evidence: [
    { label: { pt: "Visualização de voluntários", en: "Volunteer profiles" }, url: `${repository}/commit/8b20ebf2dca2a7281cb08cbe9ec3be914ca9de38` },
    { label: { pt: "Sistema de seguidores", en: "Following system" }, url: `${repository}/commit/4da73a24731a582468b0d96f73a8843aeb6d603f` },
  ],
}];

// Copy before sorting: new projects can be added without changing the rendering component.
export function sortProjects(items: readonly Project[] = projects) {
  return [...items].sort((a, b) => a.startDate.localeCompare(b.startDate));
}
