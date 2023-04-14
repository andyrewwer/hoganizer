import {test, expect, Page} from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/React App/);
  await expect(page.locator(".container")).toHaveCount(1);
});

let numberOfParticipants = 11;
test('scroll between different ones', async ({ page }) => {
  await page.goto('/');
  await page.evaluate("document.body.style.zoom=0.6")
  await page.locator(".container").press("ArrowLeft", {delay: 500});


  for (let i = 0; i < numberOfParticipants + 1; i++) {
    await moveAndScreenshot(page, "Excitable", i === 0 ? 'full' : `${i}`);
  }

  for (let i = 0; i < numberOfParticipants + 1; i++) {
    await moveAndScreenshot(page, "Adjustment", i === 0 ? 'full' : `${i}`);
  }

  for (let i = 0; i < numberOfParticipants + 1; i++) {
    await moveAndScreenshot(page, "Recognition", i === 0 ? 'full' : `${i}`);
  }
});

const moveAndScreenshot = async (page: Page, title: string, prefix: string) => {
  await page.locator(".container").press("ArrowRight", {delay: 500});
  await page.locator(".container").screenshot({ path: `screenshots/${title}-${prefix}-screenshot.png` });
  await expect(page.locator(".container")).toContainText(title);
}