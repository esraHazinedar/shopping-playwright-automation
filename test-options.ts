import { test as base, expect, Page, Route } from '@playwright/test';
import { PageManager } from './page-objects/pageManager';

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
   
   //globalsQaURL: ['', { option: true }] ,
  
  globalsQaURL: async ({ page }, use, testInfo) => {
    console.log('Running environment:', testInfo.project.name);
    // Use testInfo.project.use.baseURL
    const envURL = testInfo.project.use.baseURL as string;
    await use(envURL);
  },

    contactPage: async({page,globalsQaURL},use)=>{
         const pm = new PageManager(page)
         await blockAdsBeforeLoad(page);
        await page.goto(globalsQaURL)
        await expect(page).toHaveURL(globalsQaURL);
        await pm.navigateTo.navigateToContactPage();
        await use(pm)
    },


    homePage:  async({page,globalsQaURL},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto(globalsQaURL)
       await expect(page).toHaveURL(globalsQaURL);
        await pm.navigateTo.navigateToHomePage();
        await use(pm)

    },
     productPage:  async({page,globalsQaURL},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto(globalsQaURL)
        await expect(page).toHaveURL(globalsQaURL);
        await pm.navigateTo.navigateToProductsPage();
        await use(pm)

    },
     cartPage:  async({page,globalsQaURL},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto(globalsQaURL)
        await expect(page).toHaveURL(globalsQaURL);
        await pm.navigateTo.navigateToCartPage();
        await use(pm)

    },
     loginPage:  async({page,globalsQaURL},use)=>{
 const pm = new PageManager(page)
 await blockAdsBeforeLoad(page);
        await page.goto(globalsQaURL)
       await expect(page).toHaveURL(globalsQaURL);
        await pm.navigateTo.navigateToLoginSignUpPage();
        await use(pm)

    }
})

export{expect}

