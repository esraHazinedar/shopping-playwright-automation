import { Page } from '@playwright/test';

export class NavigationPage {

    readonly page: Page
    constructor(page: Page) {
        this.page = page;
    }


    async navigateToLoginSignUpPage() {
        await this.page.getByText(' Signup / Login').click()
    }


    async navigateToHomePage() {
        await this.page.getByText(' Home').click()
    }


    async navigateToContactPage() {
        await this.page.getByText(' Contact us').click()
    }

    async navigateToProductsPage() {
        await this.page.getByText(' Products').click()
    }







}