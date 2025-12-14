import {test as base,expect} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'    
export type TestOptions = {
    globalsQaURL: string
    contactPage: PageManager;
    homePage: PageManager;

}

export const test = base.extend<TestOptions>({
   
    globalsQaURL: ['',{option: true}],

    contactPage: async({page},use)=>{
         const pm = new PageManager(page)
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToContactPage();
        await use(pm)
    },


    homePage:  async({page},use)=>{
 const pm = new PageManager(page)
        await page.goto('/')
        await expect(page).toHaveURL('https://automationexercise.com/')
        await pm.navigateTo.navigateToHomePage();
        await use(pm)

    }
})

export{expect}