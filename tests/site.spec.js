const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("node:fs/promises");

test("homepage presents current identity, selected papers, and software", async ({ page }, testInfo) => {
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Onur Cankur", exact: true })).toBeVisible();
  await expect(page.locator(".profile-role")).toContainText("Postdoctoral Researcher");
  await expect(page.locator(".profile-role")).toContainText("IT4Innovations");
  await expect(page.locator(".selected-publications .publication-entry")).toHaveCount(3);
  await expect(page.locator(".software-item")).toHaveCount(2);
  await expect(page.getByRole("img", { name: "Portrait of Onur Cankur" })).toBeVisible();
  await expect(page.locator(".profile-links a", { hasText: "CV" })).toHaveAttribute("href", "/files/OnurCankurCV.pdf");
  await fs.mkdir("test-results/previews", { recursive: true });
  await page.screenshot({ path: `test-results/previews/home-${testInfo.project.name}.png`, fullPage: true });
  expect(runtimeErrors).toEqual([]);
});

test("all main pages are accessible and fit the viewport", async ({ page }, testInfo) => {
  for (const [route, heading] of [
    ["/", "Onur Cankur"],
    ["/research/", "Research"],
    ["/research/gpu-workload-telemetry/", "Production GPU workloads through system telemetry"],
    ["/research/code-level-performance-analysis/", "From profiling tools to programmatic analysis"],
    ["/publications/", "Publications"],
    ["/software/", "Software"],
    ["/teaching/", "Teaching"],
    ["/service/", "Service"],
    ["/news/", "News archive"],
    ["/cv/", "Curriculum vitae"],
  ]) {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(heading);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
    if (["/service/", "/news/", "/research/gpu-workload-telemetry/", "/research/code-level-performance-analysis/"].includes(route)) {
      await fs.mkdir("test-results/previews", { recursive: true });
      await page.screenshot({
        path: `test-results/previews/${route.split("/").filter(Boolean).join("-")}-${testInfo.project.name}.png`,
        fullPage: true,
      });
    }
  }
  await page.goto("/publications/");
  await page.screenshot({ path: `test-results/previews/publications-${testInfo.project.name}.png`, fullPage: true });
});

test("publications support search, year and category filters, and citations", async ({ page }) => {
  await page.goto("/publications/");
  await expect(page.locator("[data-publication]")).toHaveCount(9);
  const visible = page.locator("[data-publication]:visible");
  await expect(visible).toHaveCount(9);
  await page.getByRole("button", { name: "Preprints", exact: true }).click();
  await expect(visible).toHaveCount(2);
  await expect(visible.first()).toContainText("Preprint");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search publications" }).fill("production GPU");
  await expect(visible).toHaveCount(2);
  await page.getByRole("searchbox").fill("no-such-publication");
  await expect(visible).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("No publications match");
  await page.getByRole("searchbox").fill("");
  await expect(visible).toHaveCount(9);

  const year = page.getByRole("combobox", { name: "Year", exact: true });
  await year.selectOption("2025");
  await expect(visible).toHaveCount(2);
  await expect(page.locator("h2.bibliography:visible")).toHaveText(["2025"]);
  await page.getByRole("button", { name: "Journals", exact: true }).click();
  await expect(visible).toHaveCount(1);
  await expect(visible).toContainText("CUSMART");
  await page.getByRole("searchbox").fill("telemetry");
  await expect(visible).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("No publications match");
  await page.getByRole("searchbox").fill("");
  await expect(visible).toHaveCount(1);
  await year.selectOption("2026");
  await expect(visible).toHaveCount(0);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(visible).toHaveCount(1);
  await expect(visible).toContainText("Characterizing Production GPU Workloads");
  await year.selectOption("all");
  await expect(visible).toHaveCount(9);

  const citation = visible.first().locator("details");
  await citation.locator("summary").click();
  await expect(citation.locator("pre")).toBeVisible();
  await expect(citation.locator("code")).toContainText("cankur2026telemetry");
  await expect(citation.locator("code")).not.toContainText("selected =");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await citation.getByRole("button", { name: "Copy BibTeX" }).click();
  await expect(citation.getByRole("button", { name: "Copy BibTeX" })).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("cankur2026telemetry");
});

test("theme preference persists and dark mode is accessible", async ({ page }, testInfo) => {
  await page.goto("/");
  const root = page.locator("html");
  const toggle = page.getByRole("button", { name: "Change color theme" });
  await toggle.click();
  await toggle.click();
  await expect(root).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(root).toHaveAttribute("data-theme", "dark");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({ path: `test-results/previews/home-dark-${testInfo.project.name}.png`, fullPage: true });
});

test("navigation works with keyboard and on small screens", async ({ page }) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await menu.click();
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.locator("h1")).toHaveText("Research");
});

test("research software pages, CV, and legacy links remain available", async ({ page, request }) => {
  for (const project of ["hatchet", "pipit", "cusmart"]) {
    await page.goto(`/software/${project}/`);
    await expect(page.locator("h1")).toContainText(new RegExp(project, "i"));
    await expect(page.getByRole("link", { name: "Source code" })).toHaveAttribute("href", /github\.com/);
  }
  const cv = await request.get("/files/OnurCankurCV.pdf");
  expect(cv.ok()).toBe(true);
  expect((await cv.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const aboutRedirect = await request.get("/about/");
  expect(await aboutRedirect.text()).toContain("url=https://ocnkr.github.io/");
  const talkRedirect = await request.get("/talks/2022-21-06-tools-workshop-1");
  expect(await talkRedirect.text()).toContain("https://ocnkr.github.io/talks/#call-graphs");
});

test("research stories connect findings with papers and software", async ({ page }) => {
  await page.goto("/research/");
  await page.getByRole("link", { name: "Production GPU workloads through system telemetry" }).click();
  await expect(page).toHaveURL(/\/research\/gpu-workload-telemetry\/$/);
  await expect(page.locator(".research-story")).toContainText("75,703 GPU jobs");
  await expect(page.getByRole("link", { name: "Published paper · IPDPS 2026" })).toHaveAttribute(
    "href",
    "https://ieeexplore.ieee.org/abstract/document/11575343",
  );
  await expect(page.getByRole("link", { name: "Analysis code" })).toHaveAttribute(
    "href",
    "https://github.com/hpcgroup/ldms-analysis-scripts-ipdps26",
  );
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Research", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  if (await menu.isVisible()) await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "All research", exact: true }).click();
  await page.getByRole("link", { name: "From profiling tools to programmatic analysis" }).click();
  await expect(page).toHaveURL(/\/research\/code-level-performance-analysis\/$/);
  await expect(page.getByRole("link", { name: "Profiling-tool evaluation · ISC 2022" })).toHaveAttribute(
    "href",
    "https://dl.acm.org/doi/10.1007/978-3-031-07312-0_11",
  );
  await expect(page.getByRole("link", { name: /2024 preprint/ })).toHaveAttribute("href", "https://arxiv.org/abs/2401.13150");
  await page.getByRole("link", { name: "Hatchet: software and my contributions" }).click();
  await expect(page).toHaveURL(/\/software\/hatchet\/$/);
});

test("service and the complete news archive are easy to find", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".news-section .news-item")).toHaveCount(3);
  await page.getByRole("link", { name: "View all updates" }).click();
  await expect(page).toHaveURL(/\/news\/$/);
  await expect(page.getByRole("heading", { name: "2026", exact: true })).toBeVisible();
  await expect(page.locator(".news-archive .news-item")).toHaveCount(3);
  await expect(page.locator(".news-archive time")).toHaveText(["Jul 2026", "May 2026", "May 2026"]);
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Service", exact: true }).click();
  await expect(page).toHaveURL(/\/service\/$/);
  await expect(page.locator(".service-group")).toHaveCount(4);
  await expect(page.locator("#program-committees").locator("..").locator("li").first()).toHaveText("2027: IPDPS, SCI");
  await expect(page.locator("#program-committees").locator("..")).toContainText("External reviewer");
});

test("publication content and navigation remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4000/publications/");
  await expect(page.locator("[data-publication]")).toHaveCount(9);
  await expect(page.locator("[data-publication-tools]")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await context.close();
});
