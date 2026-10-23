import assert from "node:assert/strict";
import { test } from "node:test";
import { contactSchema } from "../src/lib/contact-schema";
import { POST } from "../src/app/api/contact/route";
import { sortProjects, projects } from "../src/data/projects";

const valid = { name: "Teste DIAW", email: "teste@example.com", message: "Mensagem de teste de validação." };
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/contact", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}
test("schema validates and normalizes legitimate messages", () => {
  const result = contactSchema("pt").parse({ ...valid, name: "  Luiz  " });
  assert.equal(result.name, "Luiz");
});
test("schema rejects invalid email, whitespace, header injection, honeypot and excessive input", () => {
  for (const data of [{ ...valid, email: "invalid" }, { ...valid, name: "  " }, { ...valid, name: "Name\r\nHeader" }, { ...valid, website: "spam" }, { ...valid, message: "a".repeat(5001) }]) {
    assert.equal(contactSchema("pt").safeParse(data).success, false);
  }
});
test("schema returns localized validation messages", () => {
  const error = contactSchema("en").safeParse({ ...valid, name: "" });
  assert.equal(error.success, false);
  if (!error.success) assert.match(error.error.issues[0].message, /Enter your name/);
});
test("API rejects malformed JSON, invalid input, cross-origin calls and oversized messages", async () => {
  assert.equal((await POST(new Request("http://localhost:3000/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await POST(request({}))).status, 400);
  assert.equal((await POST(request(valid, { origin: "https://attacker.example" }))).status, 403);
  assert.equal((await POST(request({ ...valid, message: "a".repeat(13000) }))).status, 413);
  assert.equal((await POST(request(valid, { "content-type": "text/plain" }))).status, 415);
});
test("API returns unavailable without credentials rather than pretending to send", async () => {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  try { assert.equal((await POST(request(valid))).status, 503); }
  finally {
    if (key) process.env.RESEND_API_KEY = key;
    if (from) process.env.CONTACT_FROM_EMAIL = from;
  }
});
test("timeline sorts oldest to newest without mutating the data source", () => {
  const source = [{ ...projects[0], id: "new", startDate: "2027-01-01" }, { ...projects[0], id: "old", startDate: "2025-01-01" }];
  assert.deepEqual(sortProjects(source).map(p => p.id), ["old", "new"]);
  assert.equal(source[0].id, "new");
});
