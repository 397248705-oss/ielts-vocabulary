import { expect, test } from '@playwright/test';

test('mobile learner can open and reveal a word card', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('今日任务')).toBeVisible();
  await page.getByRole('button', { name: '开始学习' }).click();
  await expect(page.getByText('abandon')).toBeVisible();

  await page.getByRole('button', { name: '查看释义' }).click();
  await expect(page.getByText('放弃；抛弃')).toBeVisible();
});

test('manifest is available', async ({ page }) => {
  await page.goto('/');

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestHref).not.toBeNull();

  const response = await page.request.get(new URL(manifestHref!, page.url()).toString());

  expect(response.ok()).toBe(true);

  const manifest = await response.json();
  expect(manifest.start_url).toBe('./');
  expect(manifest.scope).toBe('./');
  expect(manifest.icons[0].src).toBe('./icons/icon.svg');
});
