"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { translations } from "@/lib/translations";
import type { Locale } from "@/data/projects";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = translations[locale];
  const [status, setStatus] = useState<"idle" | "success" | "failure" | "unavailable" | "rateLimited">("idle");
  const locked = useRef(false);
  const previousLocale = useRef(locale);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, trigger } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema(locale)), mode: "onBlur",
  });
  useEffect(() => {
    if (previousLocale.current !== locale) {
      previousLocale.current = locale;
      if (Object.keys(errors).length) void trigger();
    }
  }, [locale, trigger, errors]);
  async function submit(values: ContactValues) {
    if (locked.current) return;
    locked.current = true;
    setStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }), signal: AbortSignal.timeout(20000),
      });
      if (response.ok) { setStatus("success"); reset(); }
      else setStatus(response.status === 503 ? "unavailable" : response.status === 429 ? "rateLimited" : "failure");
    } catch { setStatus("failure"); }
    finally { locked.current = false; }
  }
  return <form className="contact-form" onSubmit={event => { void handleSubmit(submit)(event); }} noValidate aria-label={t.formTitle}>
    <h3>{t.formTitle}</h3><p className="muted form-intro">{t.formIntro} {t.required}</p>
    <div className="form-row">
      <div className="field"><label htmlFor="name">{t.name} <span aria-hidden="true">*</span></label>
        <input id="name" autoComplete="name" maxLength={100} placeholder={t.namePlaceholder} aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
        {errors.name && <p id="name-error" className="field-error">{errors.name.message}</p>}</div>
      <div className="field"><label htmlFor="email">{t.email} <span aria-hidden="true">*</span></label>
        <input id="email" type="email" autoComplete="email" maxLength={254} placeholder={t.emailPlaceholder} aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        {errors.email && <p id="email-error" className="field-error">{errors.email.message}</p>}</div>
    </div>
    <div className="field"><label htmlFor="message">{t.message} <span aria-hidden="true">*</span></label>
      <textarea id="message" rows={5} maxLength={5000} placeholder={t.messagePlaceholder} aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} />
      {errors.message && <p id="message-error" className="field-error">{errors.message.message}</p>}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" {...register("website")} /></div>
    <button className="button button-primary submit-button" type="submit" disabled={isSubmitting}>
      {isSubmitting ? <>{t.sending}<LoaderCircle className="spin" size={18} /></> : <>{t.send}<ArrowUpRight size={18} /></>}
    </button>
    <div aria-live="polite" aria-atomic="true" className={`form-feedback ${status === "success" ? "success" : ""}`}>
      {status !== "idle" && <p role={status === "success" ? "status" : "alert"}>{status === "success" && <CheckCircle2 size={18} />}{t[status]}</p>}
    </div>
    <p className="form-privacy">{t.privacy}</p>
  </form>;
}
