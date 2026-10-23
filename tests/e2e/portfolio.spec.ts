import { test, expect, type Route } from "@playwright/test";

for (const width of [1440, 1024, 768, 390, 360]) {
  test(`layout, navigation and translation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Luiz Moura." })).toBeVisible();
    const portrait = page.locator(".profile-photo img");
    await expect(portrait).toHaveAttribute("alt", "Foto de Luiz Gustavo Moura e Souza");
    await expect.poll(() => portrait.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    const photoBounds = await portrait.boundingBox();
    expect(photoBounds).not.toBeNull();
    expect(photoBounds!.width / photoBounds!.height).toBeCloseTo(360 / 340, 1);
    const projectImage = page.locator(".project-visual img");
    await projectImage.scrollIntoViewIfNeeded();
    await expect(projectImage).toBeVisible();
    await expect.poll(() => projectImage.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width <= 700) await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.locator("#main-navigation").getByRole("link", { name: "Projetos", exact: true }).click();
    await expect(page).toHaveURL(/#projetos$/);
    if (width <= 700) await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute("aria-expanded", "false");
    const before = await page.locator("#projetos").evaluate(el => el.getBoundingClientRect().top);
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(portrait).toHaveAttribute("alt", "Photo of Luiz Gustavo Moura e Souza");
    await expect(page.getByRole("heading", { name: "Turning learning into real projects." })).toBeVisible();
    const after = await page.locator("#projetos").evaluate(el => el.getBoundingClientRect().top);
    expect(Math.abs(after - before)).toBeLessThan(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(errors).toEqual([]);
  });
}
test("client and real API validation are accessible and localized", async ({ page, request }) => {
  await page.goto("/#contato");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#message-error")).toBeVisible();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("#name-error")).toHaveText(/Enter your name/);
  const response = await request.post("/api/contact", { data: { name: "", email: "bad", message: "short" } });
  expect(response.status()).toBe(400);
  expect((await response.json()).fields.email).toBeTruthy();
});
test("screenshots of the actual implementation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".project-visual img").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".project-visual img").evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "docs/screenshots/hero-desktop.png" });
  await page.screenshot({ path: "docs/screenshots/desktop-pt.png", fullPage: true });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.screenshot({ path: "docs/screenshots/desktop-en.png", fullPage: true });
  await page.getByRole("button", { name: "Português", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/screenshots/mobile-pt.png", fullPage: true });
});

test("contact pending, duplicate prevention, success and failure feedback (controlled responses)", async ({ page }) => {
  let pending: Route | undefined;
  let requests = 0;
  await page.route("**/api/contact", route => { requests++; pending = route; });
  await page.goto("/#contato");
  async function fill() {
    await page.locator("#name").fill("Teste de interface");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("Mensagem de teste controlado da interface.");
  }
  await fill();
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("button", { name: "Enviando…" })).toBeDisabled();
  await expect.poll(() => pending !== undefined).toBe(true);
  expect(requests).toBe(1);
  await pending!.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
  await expect(page.getByRole("status")).toHaveText(/Mensagem enviada/);
  await expect(page.locator("#name")).toHaveValue("");
  pending = undefined;
  await fill();
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect.poll(() => pending !== undefined).toBe(true);
  await pending!.fulfill({ status: 502, contentType: "application/json", body: '{"error":"delivery_failed"}' });
  await expect(page.locator(".contact-form").getByRole("alert")).toHaveText(/Não foi possível enviar/);
  await expect(page.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
});
