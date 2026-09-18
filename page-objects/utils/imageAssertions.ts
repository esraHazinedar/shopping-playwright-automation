import { Locator, expect } from '@playwright/test';

/**
 * Verifies every image matched by `images` has actually loaded (not a broken/404 image).
 * DOM-based check (img.complete / naturalWidth), not a visual/screenshot comparison.
 * Polls via toPass() because a large grid of eagerly-loaded images can still be
 * mid-download when this runs — never use waitForTimeout for this.
 *
 * Reusable across any page object with product imagery (home, products, cart, etc.).
 */
export async function verifyNoBrokenImages(images: Locator, timeout = 20000) {
    await expect(images.first()).toBeVisible();

    await expect(async () => {
        const stillLoading = await images.evaluateAll(
            (imgs) => (imgs as HTMLImageElement[]).filter((img) => !img.complete).length
        );
        expect(stillLoading).toBe(0);
    }).toPass({ timeout });

    const brokenImageSources = await images.evaluateAll((imgs) =>
        (imgs as HTMLImageElement[])
            .filter((img) => img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src)
    );
    await expect(brokenImageSources).toEqual([]);
}
