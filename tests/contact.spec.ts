import {test,expect} from '@playwright/test';
import {PageManager} from '../page-objects/pageManager';
test.beforeEach(async({page})=>{

await page.goto('/')
 expect(page).toHaveURL('https://automationexercise.com/')



})

/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Contact Us' button
5. Verify 'GET IN TOUCH' is visible
6. Enter name, email, subject and message
7. Upload file
8. Click 'Submit' button
9. Click OK button
10. Verify success message 'Success! Your details have been submitted successfully.' is visible
11. Click 'Home' button and verify that landed to home page successfully
 */

test('Contact Us Test', async ({ page }) => {
    
    const pm = new PageManager(page);
    await pm.navigateTo.navigateToContactPage();
    await pm.toContactPage.fillContactForm('Test User', 'test@example.com', '/Users/esrahazinedar/contains_structured_data_detailed_report.csv');



});


