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
  const response = await page.goto('/manifest.webmanifest');

  expect(response?.ok()).toBe(true);
});
