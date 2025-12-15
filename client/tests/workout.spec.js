import { test, expect } from "@playwright/test";

test("create workout shows in list", async ({ page }) => {
  const apiBase = process.env.API_BASE_URL || "http://localhost:8080";

  const resp = await fetch(`${apiBase}/api/auth/dev-login`, { method: "POST" });
  const { token, user } = await resp.json();

  await page.goto("http://localhost:5173/login");
  await page.evaluate(({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }, { token, user });

  await page.goto("http://localhost:5173/dashboard");

  await page.getByRole("button", { name: "Add Workout" }).click();
  await expect(page.getByText(/Run •/)).toBeVisible();
});
