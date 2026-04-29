import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://qa-risk-analyzer.vercel.app/');
  await page.getByRole('button', { name: '📝 Plain Text' }).click();
});

test('single letter input enables analyze button', async ({ page }) => {
  await page.locator('textarea').fill('a');
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeEnabled();
});

test('extremely long input does not crash the app', async ({ page }) => {
  const longText = 'This is a test sentence. '.repeat(400); // ~10,000 words
  await page.locator('textarea').fill(longText);
  await expect(page.locator('textarea')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeEnabled();
});

test('numbers only input is accepted', async ({ page }) => {
  await page.locator('textarea').fill('123456789012345678901234567890');
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeEnabled();
});

test('chinese characters do not break the form', async ({ page }) => {
  await page.locator('textarea').fill('修复用户登录页面的内存泄漏问题。更新了认证模块。');
  await expect(page.locator('textarea')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeEnabled();
});

test('arabic text does not break the form', async ({ page }) => {
  await page.locator('textarea').fill('إصلاح مشكلة في وحدة المصادقة وتحديث واجهة المستخدم');
  await expect(page.locator('textarea')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeEnabled();
});

test('emoji only input is accepted', async ({ page }) => {
  await page.locator('textarea').fill('🔥💀🚀⚡️🎯🔬💥🛡️');
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeEnabled();
});

test('XSS script injection is treated as plain text', async ({ page }) => {
  const xssPayload = `<script>alert('hacked')</script>
  Fix login vulnerability in auth module`;

  await page.locator('textarea').fill(xssPayload);

  // Check script did not execute - no dialog appeared
  let alertFired = false;
  page.on('dialog', () => { alertFired = true; });

  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('What gets sent to AI')).toBeVisible();

  // The script tag should appear as plain text, not execute
  expect(alertFired).toBe(false);
});

test('SQL injection is treated as plain text', async ({ page }) => {
  const sqlPayload = `'; DROP TABLE users;--
  Fix authentication bypass vulnerability`;

  await page.locator('textarea').fill(sqlPayload);
  await page.getByRole('button', { name: 'Analyze →' }).click();

  // App should still show transparency panel normally
  await expect(page.getByText('What gets sent to AI')).toBeVisible();
});

test('wrong URL format does not crash the app', async ({ page }) => {
  await page.getByRole('button', { name: '🐙 GitHub PR' }).click();
  await page.locator('input[type="text"]').fill('notavalidurl');
  await page.locator('textarea').fill('Fix memory leak in authentication module');
  await page.getByRole('button', { name: 'Analyze →' }).click();

  // Should show transparency panel or an error — not crash
  const panelVisible = await page.getByText('What gets sent to AI').isVisible();
  const errorVisible = await page.getByText('⚠️').isVisible();
  expect(panelVisible || errorVisible).toBe(true);
});

test('demo button resets form cleanly mid typing', async ({ page }) => {
  // Start typing
  await page.locator('textarea').fill('I was typing something important');

  // Accidentally click demo
  await page.getByRole('button', { name: '📦 facebook/react · Fix' }).click();

  // Transparency panel should appear cleanly with demo data
  await expect(page.getByText('What gets sent to AI')).toBeVisible();

  // Cancel and check form is not in broken state
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('button', { name: 'Analyze →' })).toBeVisible();
});