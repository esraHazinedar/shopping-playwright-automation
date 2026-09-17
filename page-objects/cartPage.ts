import {Page,expect} from "@playwright/test";

export class CartPage{
     readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }




async verifyCartIsNotEmpty() {
        await expect(this.page.locator('.cart_info tbody tr').first()).toBeVisible();
    }

    async clickProceedToCheckout() {
        const proceedButton = this.page.locator('.btn.btn-default.check_out');
        await expect(proceedButton).toBeVisible();
        await proceedButton.click();
        await this.page.waitForLoadState('load');
        await expect(this.page.getByRole('heading', { name: 'Address Details' })).toBeVisible({ timeout: 60000 });
    }

    async verifyDeliveryAddress(firstName: string, address: string) {
        const deliveryBlock = this.page.locator('#address_delivery');
        await expect(deliveryBlock).toBeVisible();
        await expect(deliveryBlock).toContainText(firstName);
        await expect(deliveryBlock).toContainText(address);
    }

    async downloadInvoiceAfterOrder() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.getByRole('link', { name: 'Download Invoice' }).click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBeTruthy();
    }

    async removeFirstProductFromCart() {
        await this.page.waitForLoadState('load');
        const cartRows = this.page.locator('.cart_info tbody tr');
        await expect(cartRows.first()).toBeVisible({ timeout: 10000 });
        const initialCount = await cartRows.count();
        const firstRow = cartRows.nth(0);
        const deleteButton = firstRow.locator('a.cart_quantity_delete');
        await expect(deleteButton).toBeVisible({ timeout: 5000 });
        await deleteButton.scrollIntoViewIfNeeded();
        await deleteButton.click();
        await expect(cartRows).toHaveCount(initialCount - 1, { timeout: 30000 });
    }

    async subscribeToNewsletterInCartPage(email: string) {

        
        await this.page.locator('footer').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Subscription')).toBeVisible();
        const emailInputBox = this.page.getByPlaceholder('Your email address')
        await emailInputBox.click()
        await emailInputBox.fill(email);
        const arrowButton = this.page.locator('footer button[type="submit"]');
        await arrowButton.click();
        await expect(this.page.getByText('You have been successfully subscribed!')).toBeVisible();




    }


















}




