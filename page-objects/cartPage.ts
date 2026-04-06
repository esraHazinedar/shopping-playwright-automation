import {Page,expect} from "@playwright/test";

export class CartPage{
     readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }




async subscribeToNewsletterInCartPage(email: string) {

        
        await this.page.locator('footer').scrollIntoViewIfNeeded();
        expect(this.page.getByText('Subscription')).toBeVisible();
        const emailInputBox = this.page.getByPlaceholder('Your email address')
        await emailInputBox.click()
        await emailInputBox.fill(email);
        const arrowButton = this.page.locator('footer button[type="submit"]');
        await arrowButton.click();
        expect(this.page.getByText('You have been successfully subscribed!')).toBeVisible();




    }


















}




