import { test, expect } from '@playwright/test';

test('Complete purchase flow — happy path', async ({ page }) => {

  // Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Verify login succeeded
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.inventory_list')).toBeVisible();

  // Add product to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Verify cart badge shows 1 item
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Go to cart
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  // Verify product is in cart
  await expect(page.locator('[data-test="inventory-item-name"]'))
    .toHaveText('Sauce Labs Backpack');

  // Proceed to checkout
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

  // Fill in customer details
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('User');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  // Verify order summary page
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  await expect(page.locator('[data-test="inventory-item-name"]'))
    .toHaveText('Sauce Labs Backpack');

  // Complete purchase
  await page.locator('[data-test="finish"]').click();

  // Verify order confirmation
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  await expect(page.locator('[data-test="complete-header"]'))
    .toHaveText('Thank you for your order!');
});


test('Login fails with wrong password', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  // Should stay on login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');

  // Error message should appear
  await expect(page.locator('[data-test="error"]'))
    .toBeVisible();
  await expect(page.locator('[data-test="error"]'))
    .toContainText('Username and password do not match');
});


test('Checkout blocked with empty cart', async ({ page }) => {

  // Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // Go to cart without adding anything
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  // Cart should be empty
  await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);

  // Checkout button should still be visible but cart is empty
  await expect(page.locator('[data-test="checkout"]')).toBeVisible();
});