import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://qa-risk-analyzer.vercel.app/');
});

test('page has correct title', async ({ page }) => {
  await expect(page).toHaveTitle('QA Risk Analyzer');
});

test('all workflow buttons are visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: '🐙 GitHub PR' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🦊 GitLab MR' })).toBeVisible();
  await expect(page.getByRole('button', { name: '📋 Jira Ticket' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🔷 Azure DevOps' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🪣 Bitbucket PR' })).toBeVisible();
  await expect(page.getByRole('button', { name: '📝 Plain Text' })).toBeVisible();
});

test('textarea has a placeholder', async ({ page }) => {
  await expect(page.locator('textarea')).toBeVisible();
  const placeholder = await page.locator('textarea').getAttribute('placeholder');
  expect(placeholder).not.toBeNull();
});

test('switching to Azure DevOps shows correct URL label', async ({ page }) => {
  await page.getByRole('button', { name: '🔷 Azure DevOps' }).click();
  await expect(page.getByText('Azure DevOps PR URL')).toBeVisible();
});

test('secret scrubbing indicator is visible in header', async ({ page }) => {
  await expect(page.getByText('Secret scrubbing ON', { exact: false })).toBeVisible();
});