import { z } from "zod";
import type { Locale } from "@/data/projects";
export function contactSchema(locale: Locale = "pt") {
  const pt = locale === "pt";
  return z.object({
    name: z.string().trim().min(2, pt ? "Informe seu nome (mínimo de 2 caracteres)." : "Enter your name (at least 2 characters).")
      .max(100, pt ? "Use até 100 caracteres." : "Use up to 100 characters.")
      .refine(v => !/[\r\n]/.test(v), pt ? "Informe o nome em uma linha." : "Enter your name on one line."),
    email: z.string().trim().min(1, pt ? "Informe seu e-mail." : "Enter your email.")
      .email(pt ? "Informe um e-mail válido." : "Enter a valid email.").max(254),
    message: z.string().trim().min(10, pt ? "Escreva pelo menos 10 caracteres." : "Write at least 10 characters.")
      .max(5000, pt ? "Use até 5.000 caracteres." : "Use up to 5,000 characters."),
    website: z.string().max(0).optional(),
  });
}
export type ContactValues = z.infer<ReturnType<typeof contactSchema>>;
