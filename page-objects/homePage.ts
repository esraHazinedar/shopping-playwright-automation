import { Page, expect } from "@playwright/test";
import { verifyNoBrokenImages } from "./utils/imageAssertions";

export class HomePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }


    async subscribeToNewsletter(email: string) {

        await this.page.locator('footer').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Subscription')).toBeVisible();
        const emailInputBox = this.page.getByPlaceholder('Your email address')
        await emailInputBox.click()
        await emailInputBox.fill(email);
        const arrowButton = this.page.locator('footer button[type="submit"]');
        await arrowButton.click();
        await expect(this.page.getByText('You have been successfully subscribed!')).toBeVisible();

    }



    

    /**
     * 
     * @param linkName - the link name you want to navigate should be entered
     */

    async homePageNavBarItemsClickEach(linkName: string) {
        const link = this.page
            .locator('.shop-menu.pull-right ul li a')
            .filter({ hasText: linkName })
            .first();

        await expect(link).toBeVisible();
        await link.click();



    }

    /**
     * 
     * @param expectedNavItems - should be navıtems all 
     * @param expectedCount - should be the expected length of the all nav ıtems
     */

    async homepageVerifyNavItemsExistAll(expectedNavItems: string[], expectedCount: number) {

        const navLinks = this.page.locator('.shop-menu.pull-right ul li a');
        await expect(navLinks).toHaveCount(expectedCount);
        for (let i = 0; i < expectedCount; i++) {
            await expect(navLinks.nth(i)).toContainText(expectedNavItems[i]);
        };

    }

    async subscribeWithInvalidEmail(email: string) {
        await this.page.locator('footer').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Subscription')).toBeVisible();
        const emailInputBox = this.page.getByPlaceholder('Your email address');
        await emailInputBox.click();
        await emailInputBox.fill(email);
        const arrowButton = this.page.locator('footer button[type="submit"]');
        await arrowButton.click();
        await expect(this.page.getByText('You have been successfully subscribed!')).toBeHidden();
    }

    async subscribeWithEmptyEmail() {
        await this.page.locator('footer').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Subscription')).toBeVisible();
        const arrowButton = this.page.locator('footer button[type="submit"]');
        await arrowButton.click();
        await expect(this.page.getByText('You have been successfully subscribed!')).toBeHidden();
    }

    async addToCartFromFeaturesItemsAndViewCart() {
        await this.page.locator('.features_items').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Features Items', { exact: false })).toBeVisible();
        const addToCartLink = this.page.locator('.features_items .add-to-cart').first();
        await addToCartLink.click();
        const viewCartButton = this.page.locator('.modal-content a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 8000 });
        await viewCartButton.click();
        await expect(this.page).toHaveURL(/view_cart/);
        await expect(this.page.locator('.cart_info tbody tr').first()).toBeVisible();
    }

    async addToCartFromFeaturesItemsAndContinueShopping() {
        await this.page.locator('.features_items').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Features Items', { exact: false })).toBeVisible();
        const addToCartLink = this.page.locator('.features_items .add-to-cart').first();
        await addToCartLink.click();
        const continueShoppingButton = this.page.getByText('Continue Shopping');
        await continueShoppingButton.waitFor({ state: 'visible', timeout: 8000 });
        await continueShoppingButton.click();
        await expect(this.page.getByText('Added!')).toBeHidden();
        await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
        await expect(this.page.getByText('Features Items', { exact: false })).toBeVisible();
    }

    async verifyNoBrokenProductImages() {
        await this.page.locator('.features_items').scrollIntoViewIfNeeded();
        const productImages = this.page.locator('.features_items .product-image-wrapper img, .recommended_items img');
        await verifyNoBrokenImages(productImages);
    }

    async addToCartFromRecommendedItems() {
        await this.page.locator('.recommended_items').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('recommended items', { exact: false })).toBeVisible();
        const addToCartLink = this.page.locator('.recommended_items .add-to-cart').first();
        await addToCartLink.click();
        const viewCartButton = this.page.locator('.modal-content a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 8000 });
        await viewCartButton.click();
        await expect(this.page).toHaveURL(/view_cart/);
        await expect(this.page.locator('.cart_info tbody tr').first()).toBeVisible();
    }

    async subscribeAfterClearingInvalidEntry(invalidEmail: string, validEmail: string) {
        await this.page.locator('footer').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Subscription')).toBeVisible();
        const emailInputBox = this.page.getByPlaceholder('Your email address');
        await emailInputBox.click();
        await emailInputBox.fill(invalidEmail);
        await emailInputBox.clear();
        await emailInputBox.fill(validEmail);
        const arrowButton = this.page.locator('footer button[type="submit"]');
        await arrowButton.click();
        await expect(this.page.getByText('You have been successfully subscribed!')).toBeVisible();
    }




}





