import { test, expect } from '@playwright/test';

test('Robot picks up and removes parcels from DOM permanently', async ({ page }) => {
  await page.goto('http://localhost:8080/src/');

  const startButton = page.locator('#startButton');
  await expect(startButton).toBeVisible();
  await startButton.click();

  const totalParcels = 6;

  for (let i = 0; i < totalParcels; i++) {
    const parcel = page.locator(`#parcel-${i}`);
    await expect(parcel).toBeVisible();
    await page.waitForSelector(`#parcel-${i}`, { state: 'detached' });
    await expect(parcel).not.toBeAttached();
  }
  console.log('✅ All parcels were picked up and removed from the DOM!');
});
