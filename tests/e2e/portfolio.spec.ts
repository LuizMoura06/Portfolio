import { test, expect } from "@playwright/test";

for (const width of [1440, 1024, 768, 390, 360]) {
  test(`layout, navigation and translation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Luiz Moura." })).toBeVisible();
    await page.locator("img").scrollIntoViewIfNeeded();
    await expect(page.locator("img")).toBeVisible();
    await expect.poll(() => page.locator("img").evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width <= 700) await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.locator("#main-navigation").getByRole("link", { name: "Projetos", exact: true }).click();
    await expect(page).toHaveURL(/#projetos$/);
    if (width <= 700) await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute("aria-expanded", "false");
    const before = await page.locator("#projetos").evaluate(el => el.getBoundingClientRect().top);
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { name: "Turning learning into real projects." })).toBeVisible();
    const after = await page.locator("#projetos").evaluate(el => el.getBoundingClientRect().top);
    expect(Math.abs(after - before)).toBeLessThan(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(errors).toEqual([]);
  });
}
test("real API validation and unavailable feedback are accessible", async ({ page, request }) => {
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
  await page.locator("img").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("img").evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "docs/screenshots/desktop-pt.png", fullPage: true });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.screenshot({ path: "docs/screenshots/desktop-en.png", fullPage: true });
  await page.getByRole("button", { name: "Português", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/screenshots/mobile-pt.png", fullPage: true });
});
