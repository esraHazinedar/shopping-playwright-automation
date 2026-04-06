import {test as base,expect} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'   
import type { Page, Route } from '@playwright/test'; 
export type TestOptions = {
    globalsQaURL: string
    contactPage: PageManager;
    homePage: PageManager;
    productPage: PageManager;
    loginPage: PageManager;
    cartPage: PageManager;

}

async function blockAdsBeforeLoad(page: Page) {
  await page.context().route('**/*', (route: Route) => {
    const url = route.request().url();

    if (
      url.includes('doubleclick.net') ||
      url.includes('google_vignette') ||
      url.includes('adservice.google.com') ||
      url.match(/.*ad.*\..*/) // optional catch-all
    ) {
      return route.abort(); // block the ad
    }

    route.continue();
  });
}

export const test = base.extend<TestOptions>({
   
    globalsQaURL: ['',{option: true}],

    contactPage: async({page},use)=>{
         const pm = new PageManager(page)
         await blockAdsBeforeLoad(page);
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToContactPage();
        await use(pm)
    },


    homePage:  async({page},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToHomePage();
        await use(pm)

    },
     productPage:  async({page},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToProductsPage();
        await use(pm)

    },
     cartPage:  async({page},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToCartPage();
        await use(pm)

    },
     loginPage:  async({page},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToLoginSignUpPage();
        await use(pm)

    }
})

export{expect}