import {test, expect} from '../test-options';
import { PageManager } from '../page-objects/pageManager';




/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Scroll down to footer
5. Verify text 'SUBSCRIPTION'
6. Enter email address in input and click arrow button
7. Verify success message 'You have been successfully subscribed!' is visible
 */

test('Subscription Test', async ({ page,homePage }) => {


    const pm = new PageManager(page);
    await pm.toHomePage.subscribeToNewsletter('example@example.com')

});



test('Verifiying the test case page',async({page,homePage})=>{
 const pm = new PageManager(page);
 
  await  pm.navigateTo.navigateToHomePage();
 
 expect(page.url()).toContain('https://automationexercise.com/');
   
       const expectedNavItems = [
    'Home',
    'Products',
    'Cart',
    'Signup / Login',
    'Test Cases',
    'API Testing',
    'Video Tutorials',
    'Contact us',
  ];

   await pm.toHomePage.homepageVerifyNavItemsExistAll(expectedNavItems,expectedNavItems.length)

   await  pm.toHomePage.homePageNavBarItemsClickEach('Test Cases')
   


 })


 


