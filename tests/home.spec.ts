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

test('Subscription Test', async ({ homePage }) => {


    await homePage.toHomePage.subscribeToNewsletter('example@example.com')

});



test('Verifiying the test case page',async({homePage})=>{
 
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

   await homePage.toHomePage.homepageVerifyNavItemsExistAll(expectedNavItems,expectedNavItems.length)

   await  homePage.toHomePage.homePageNavBarItemsClickEach('Test Cases')
   


 })


 


