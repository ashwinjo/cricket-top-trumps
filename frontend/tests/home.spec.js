// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has correct title and game modes', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Check the title is present
  await expect(page.locator('h1')).toContainText('Ek Tappa Out');
  
  // Check tagline is present
  await expect(page.locator('.tagline')).toContainText('The Ultimate IPL Top Trumps Challenge');
  
  // Check game description is present
  await expect(page.locator('.game-description')).toContainText('Welcome to Ek Tappa Out!');
  
  // Check game modes are present
  await expect(page.locator('.game-mode-card')).toHaveCount(2);
  
  // Check "Play vs Computer" button is present and enabled
  const playButton = page.locator('button:has-text("Play vs Computer")');
  await expect(playButton).toBeEnabled();
  
  // Check "Coming Soon" button is present and disabled
  const comingSoonButton = page.locator('button:has-text("Coming Soon")');
  await expect(comingSoonButton).toBeDisabled();
});

test('clicking Play vs Computer navigates to game page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  // Click the play button
  await page.click('button:has-text("Play vs Computer")');
  
  // Check that we navigate to the game page
  await expect(page).toHaveURL(/\/game\/ai/);
  
  // Check that game elements are loaded
  await expect(page.locator('.game-area')).toBeVisible();
}); 