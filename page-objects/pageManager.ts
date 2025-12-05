
import { Page, expect } from "@playwright/test";
import { HomePage } from "../page-objects/homePage";
import { ProductPage } from "../page-objects/productPage";
import { LoginSignUpPage } from "../page-objects/loginSignUpPage";
import { NavigationPage } from "../page-objects/navigationPage";
import { ContactPage } from "./contactPage";



export class PageManager {
    private readonly page: Page;
    private readonly homePage: HomePage;
    private readonly productPage: ProductPage;
    private readonly loginPage: LoginSignUpPage;
    private readonly navigationPage: NavigationPage;
    private readonly contactPage: ContactPage;
    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(page);
        this.productPage = new ProductPage(page);
        this.loginPage = new LoginSignUpPage(page);
        this.navigationPage = new NavigationPage(page);
        this.contactPage = new ContactPage(page);
    }




    get navigateTo() {
        return this.navigationPage;
    }

    get toHomePage() {
        return this.homePage;
    }


    get toProductPage() {
        return this.productPage;
    }

    get toLoginPage() {
        return this.loginPage;
    }

    get toContactPage() {
        return this.contactPage;
    }



}