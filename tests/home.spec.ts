import {test, expect} from '../test-options';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';




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


// ── UI State Tests ────────────────────────────────────────────────────────────

test('home page displays featured items section on initial load', async ({ homePage: _homePage, page }) => {
    await expect(page.getByRole('heading', { name: /features items/i })).toBeVisible();
});

test('home page footer subscription section is visible before interaction', async ({ homePage: _homePage, page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.getByText('Subscription')).toBeVisible();
});

// ── Navigation Correctness ────────────────────────────────────────────────────

test('clicking Products nav item navigates to products page', async ({ homePage, page }) => {
    await homePage.toHomePage.homePageNavBarItemsClickEach('Products');
    await expect(page).toHaveURL(/products/);
});

test('clicking Cart nav item navigates to cart page', async ({ homePage, page }) => {
    await homePage.toHomePage.homePageNavBarItemsClickEach('Cart');
    await expect(page).toHaveURL(/view_cart/);
});

test('clicking Signup / Login nav item navigates to login page', async ({ homePage, page }) => {
    await homePage.toHomePage.homePageNavBarItemsClickEach('Signup / Login');
    await expect(page).toHaveURL(/login/);
});

test('clicking Contact us nav item navigates to contact page', async ({ homePage, page }) => {
    await homePage.toHomePage.homePageNavBarItemsClickEach('Contact us');
    await expect(page).toHaveURL(/contact_us/);
});

// ── Edge Cases ────────────────────────────────────────────────────────────────

test('subscription with invalid email format shows no success message', async ({ homePage }) => {
    await homePage.toHomePage.subscribeWithInvalidEmail('not-an-email');
});

test('subscription with empty email field does not show success message', async ({ homePage }) => {
    await homePage.toHomePage.subscribeWithEmptyEmail();
});

// ── Recovery Flows ────────────────────────────────────────────────────────────

test('subscription succeeds after correcting an invalid email entry', async ({ homePage }) => {
    await homePage.toHomePage.subscribeAfterClearingInvalidEntry('bademail', faker.internet.email());
});

// ─── Add to Cart from Recommended Items ──────────────────────────────────────

test('Add to Cart from Recommended Items: product added from recommended section appears in cart', async ({ homePage }) => {
    await homePage.toHomePage.addToCartFromRecommendedItems();
});

