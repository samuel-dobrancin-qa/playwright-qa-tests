import { test, expect } from '@playwright/test';

test('demo analysis runs end to end', async ({ page }) => {
  // Set longer timeout — AI analysis takes time
  test.setTimeout(120000);

  await page.goto('https://qa-risk-analyzer.vercel.app/');

  // Check page loaded correctly
  await expect(page).toHaveTitle('QA Risk Analyzer');

  // Switch workflow tabs
  await page.getByRole('button', { name: '🦊 GitLab MR' }).click();
  await page.getByRole('button', { name: '🐙 GitHub PR' }).click();

  // Run demo analysis
  await page.getByRole('button', { name: '📦 facebook/react · Fix' }).click();
  await page.getByRole('button', { name: 'Looks good — Run Analysis →' }).click();

  // Wait for AI to finish — look for risk score to appear
  await expect(page.getByText('RISK')).toBeVisible({ timeout: 90000 });

  // Now navigate tabs and verify content exists
  await page.getByRole('button', { name: '🧪 Test Cases' }).click();
  await expect(page.getByText('TC-001')).toBeVisible();

  await page.getByRole('button', { name: '🗂️ Components' }).click();
  await page.getByRole('button', { name: '🔁 Regression' }).click();
  await page.getByRole('button', { name: '💬 Slack Bot' }).click();
  await expect(page.getByText('QA Risk Bot')).toBeVisible();
});