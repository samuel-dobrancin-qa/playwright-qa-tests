import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://qa-risk-analyzer.vercel.app/');
  // Switch to Plain Text so URL is not required
  await page.getByRole('button', { name: '📝 Plain Text' }).click();
});

test('transparency panel appears before analysis runs', async ({ page }) => {
  await page.locator('textarea').fill('Fix memory leak in authentication module');
  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('What gets sent to AI')).toBeVisible();
});

test('transparency panel shows never sent section', async ({ page }) => {
  await page.locator('textarea').fill('Refactor payment processing service');
  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('Never sent')).toBeVisible();
  await expect(page.getByText('API keys')).toBeVisible();
});

test('transparency panel can be cancelled', async ({ page }) => {
  await page.locator('textarea').fill('Update user profile endpoint');
  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('What gets sent to AI')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('What gets sent to AI')).not.toBeVisible();
});

test('secret scrubber detects AWS key in context', async ({ page }) => {
  const dirtyInput = `Fix authentication bug
  Changed config.js to use new API endpoint
  Old key was AKIAIOSFODNN7EXAMPLE in config
  Removed hardcoded credentials from source`;

  await page.locator('textarea').fill(dirtyInput);
  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('Secrets detected')).toBeVisible();
  await expect(page.getByText('AWS Access Key')).toBeVisible();
});

test('secret scrubber detects GitHub token', async ({ page }) => {
  const dirtyInput = `Update deployment script
  Added token ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij12 for CI
  Modified .github/workflows/deploy.yml`;

  await page.locator('textarea').fill(dirtyInput);
  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('Secrets detected', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('GitHub Token')).toBeVisible();
});

test('clean input shows no secrets detected', async ({ page }) => {
  const cleanInput = `Fix button alignment on mobile dashboard
  Updated CSS flexbox properties in dashboard.css
  Tested on iPhone 12 and Samsung Galaxy S21`;

  await page.locator('textarea').fill(cleanInput);
  await page.getByRole('button', { name: 'Analyze →' }).click();
  await expect(page.getByText('No secrets detected', { exact: true })).toBeVisible();
});