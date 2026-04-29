import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://qa-risk-analyzer.vercel.app/');
});

test('page loads with correct title', async ({ page }) => {
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

test('switching to Jira shows correct placeholder', async ({ page }) => {
  await page.getByRole('button', { name: '📋 Jira Ticket' }).click();
  await expect(page.locator('input[type="text"]').filter({ hasAttribute: 'placeholder' })).toBeVisible();
});

test('switching to Plain Text hides URL required marker', async ({ page }) => {
  await page.getByRole('button', { name: '📝 Plain Text' }).click();
  const urlLabel = page.getByText('Reference URL (optional)');
  await expect(urlLabel).toBeVisible();
});

test('analyze button is disabled when context is empty', async ({ page }) => {
  const analyzeBtn = page.getByRole('button', { name: 'Analyze →' });
  await expect(analyzeBtn).toBeDisabled();
});

test('analyze button enables when context is filled', async ({ page }) => {
  await page.getByRole('button', { name: '📝 Plain Text' }).click();
  await page.locator('textarea').fill('This is a test change description');
  const analyzeBtn = page.getByRole('button', { name: 'Analyze →' });
  await expect(analyzeBtn).toBeEnabled();
});