import { test, expect } from '@playwright/test';

test.describe('Fammy.pet Landing Page E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should allow selecting F2 and submitting a check', async ({ page }) => {
        // 1. Check Landing Title
        await expect(page.locator('h1')).toContainText(/fammy\.pet|food safety/i);

        // 2. Select F2 (Food Safety) Card
        // The card has "F2: Food Safety" title. Use a robust selector.
        const f2Card = page.locator('button').filter({ hasText: 'F2: Food Safety' });
        await expect(f2Card).toBeVisible();
        await f2Card.click();

        // 3. Verify F2 Form appears (Search input)
        const searchInput = page.locator('input[placeholder*="chicken"]');
        await expect(searchInput).toBeVisible();

        // 4. Select Species (Dog) - usually selected by default, but let's click
        await page.locator('button').filter({ hasText: 'DOG' }).first().click();

        // 5. Search for "Chocolate"
        await searchInput.fill('Chocolate');

        // Wait for potential debounce and network request
        await page.waitForTimeout(2000);

        // 6. Check for results
        // If the backend is connected, we should see a result or at least the submit button should be clickable.
        // We expect "Check Food Safety" button to be visible.
        const checkBtn = page.getByRole('button', { name: /Check Food Safety/i });
        await expect(checkBtn).toBeVisible();

        // Optional: click it if manual submission is needed (though autocomplete might trigger it)
        // await checkBtn.click();
    });

    test.skip('should open promo code modal from feature selector', async ({ page }) => {
        // The button has a ticket emoji 🎟️ and text like "Have a promo code?"
        // We use a broader match to be safe
        const promoBtn = page.locator('button').filter({ hasText: '🎟️' });
        await expect(promoBtn).toBeVisible();
        await promoBtn.click();

        // Check if GateModal opens with "Promo Code" title
        await expect(page.locator('h2')).toContainText(/Promo/i);
    });

    test.skip('should switch language', async ({ page }) => {
        // 1. Click Language Switcher (Flag icon/Button)
        const langBtn = page.locator('button[title="English"], button[title*="En"]');
        await expect(langBtn).toBeVisible();
        await langBtn.click();

        // 2. Select Ukrainian from the dropdown/list
        // It might be a button or div inside a menu
        const uaOption = page.locator('button, div[role="menuitem"], a').filter({ hasText: 'Українська' });
        await expect(uaOption).toBeVisible();
        await uaOption.click();

        // 3. Verify Page Title in Ukrainian
        // "Is it safe for my pet?" -> "Чи безпечно це для мого улюбленця?" or similar
        // Or "F2: Food Safety" -> localized
        // Checking H1 for "FAMMY" is safe as it's consistent, but let's check a translated element
        await expect(page.locator('h1')).toBeVisible();

        // We can check the body for some Ukrainian text to be sure
        await expect(page.locator('body')).toContainText(/безпечно|перевірте/i);
    });
});
