
import { Page, expect } from "@playwright/test";
import { HomePage } from "../page-objects/homePage";
import { ProductPage } from "../page-objects/productPage";
import { LoginSignUpPage } from "../page-objects/loginSignUpPage";
import { NavigationPage } from "../page-objects/navigationPage";
import { ContactPage } from "./contactPage";
import { CartPage } from "../page-objects/cartPage";



export class PageManager {
    private readonly page: Page;
    private readonly homePage: HomePage;
    private readonly productPage: ProductPage;
    private readonly loginPage: LoginSignUpPage;
    private readonly navigationPage: NavigationPage;
    private readonly contactPage: ContactPage;
    private readonly cartPage: CartPage;
    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(page);
        this.productPage = new ProductPage(page);
        this.loginPage = new LoginSignUpPage(page);
        this.navigationPage = new NavigationPage(page);
        this.contactPage = new ContactPage(page);
        this.cartPage = new CartPage(page);
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

     get toCartPage() {
        return this.cartPage;
    }



  
  
  
 
/**
 * Close any popup or ad iframe if it exists on the page.
 * Works for normal "Close" buttons and Google Ads iframe.
 */



}






