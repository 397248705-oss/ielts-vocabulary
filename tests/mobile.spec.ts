import { expect, test } from '@playwright/test';

test('learner can start the daily plan and reveal a word card', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('今天也要向目标靠近')).toBeVisible();
  await page.locator('.summary-start').click();
  await expect(page.getByText('abandon')).toBeVisible();

  await page.getByRole('button', { name: '查看释义' }).click();
  await expect(page.getByText('放弃；抛弃')).toBeVisible();
});

test('learner can search and add a local custom word', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '词库' }).click();

  await page.getByRole('searchbox', { name: '搜索单词' }).fill('放弃');
  await expect(page.getByText('abandon')).toBeVisible();

  await page.getByRole('button', { name: '添加单词' }).click();
  await page.getByLabel('英文单词').fill('commute');
  await page.getByLabel('中文释义').fill('通勤');
  await page.getByRole('button', { name: '保存单词' }).click();
  await page.getByRole('searchbox', { name: '搜索单词' }).fill('commute');
  await expect(page.getByText('通勤', { exact: true })).toBeVisible();
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
