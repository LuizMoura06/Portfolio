import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { profile } from "@/data/profile";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "unsupported_content_type" }, { status: 415 });
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 12000) return Response.json({ error: "payload_too_large" }, { status: 413 });
    body = JSON.parse(text);
  } catch { return Response.json({ error: "invalid_json" }, { status: 400 }); }
  const locale = typeof body === "object" && body !== null && "locale" in body && body.locale === "en" ? "en" : "pt";
  const parsed = contactSchema(locale).safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_fields", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return Response.json({ error: "service_unavailable" }, { status: 503 });
  const { name, email, message } = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from, to: profile.email, replyTo: email,
      subject: `Contato pelo portfólio — ${name}`,
      text: `Nome: ${name}\nE-mail: ${email}\nIdioma: ${locale}\n\n${message}`,
    });
    if (error) {
      // Do not log API keys or visitor message content.
      console.error("Contact email provider rejected request:", error.name);
      return Response.json({ error: "delivery_failed" }, { status: error.name === "rate_limit_exceeded" ? 429 : 502 });
    }
    if (!data?.id) return Response.json({ error: "delivery_failed" }, { status: 502 });
    return Response.json({ success: true });
  } catch {
    console.error("Contact email provider unavailable");
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }
}
