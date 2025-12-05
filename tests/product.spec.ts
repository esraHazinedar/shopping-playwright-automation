import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';  
import {faker} from '@faker-js/faker';
test.beforeEach(async ({ page }) => {

    await page.goto('/')
    expect(page).toHaveURL('https://automationexercise.com/')
    
    
});


/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Products' button
5. Verify user is navigated to ALL PRODUCTS page successfully
6. The products list is visible
7. Click on 'View Product' of first product
8. User is landed to product detail pag
9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
 */


test('Verify all products and product detail page', async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo.navigateToProductsPage();
    expect(page.getByText('All Products')).toBeVisible()
    await pageManager.toProductPage.verifyProductDetailsVisible(1);
   
});


/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Products' button
5. Verify user is navigated to ALL PRODUCTS page successfully
6. Enter product name in search input and click search button
7. Verify 'SEARCHED PRODUCTS' is visible
8. Verify all the products related to search are visible
 */


test('Search Product', async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo.navigateToProductsPage();
    await pageManager.toProductPage.searchProduct('Tshirt');


});

/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click 'Products' button
5. Hover over first product and click 'Add to cart'
6. Click 'Continue Shopping' button
7. Hover over second product and click 'Add to cart'
8. Click 'View Cart' button
9. Verify both products are added to Cart
10. Verify their prices, quantity and total price
 */

test('Add Products to Cart', async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo.navigateToProductsPage();
    await pageManager.toProductPage.addFirstAndSecondProductToCart()


});


/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click 'View Product' for any product on home page
5. Verify product detail is opened
6. Increase quantity to 4
7. Click 'Add to cart' button
8. Click 'View Cart' button
9. Verify that product is displayed in cart page with exact quantity
 */

test('Add Quantity of Product in Cart', async ({ page }) => {

    const pageManager = new PageManager(page);
    await pageManager.navigateTo.navigateToProductsPage();
    await pageManager.toProductPage.addProductToCartByQuantity(3,4);


});

/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Add products to cart
5. Click 'Cart' button
6. Verify that cart page is displayed
7. Click Proceed To Checkout
8. Click 'Register / Login' button
9. Fill all details in Signup and create account
10. Verify 'ACCOUNT CREATED!' and click 'Continue' button


11. Verify ' Logged in as username' at top
12.Click 'Cart' button
13. Click 'Proceed To Checkout' button
14. Verify Address Details and Review Your Order
15. Enter description in comment text area and click 'Place Order'
16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
17. Click 'Pay and Confirm Order' button
18. Verify success message 'Your order has been placed successfully!'
19. Click 'Delete Account' button
20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
 */
test('Register, Login and Place Order', async ({ page }) => {

    const pm = new PageManager(page);
    const randomEmail = faker.internet.email(); 
    const randomName = faker.person.fullName();
    const randomPassword = faker.internet.password();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const randomCompany = faker.company.name();
    const randomAddress1 = faker.location.streetAddress();
    const randomAddress2 = faker.location.secondaryAddress();
    const randomState = faker.location.state();
    const randomCity = faker.location.city();
    const randomZipcode = faker.location.zipCode();
    const randomMobileNumber = `+1${faker.string.numeric(10)}`;  
    const randomCreditCard = faker.finance.creditCardNumber({ issuer: 'visa' });
   
    const allProducts = page.locator('.features_items .col-sm-4');
    const firstProduct = allProducts.nth(0);
    await firstProduct.hover();
    const firstAddToCartButton = firstProduct.getByText('Add to cart').first();
    await firstAddToCartButton.click();
    const viewCartButton = page.locator('.modal-content').locator('a[href="/view_cart"]');
    await viewCartButton.click();
    expect(page.url()).toContain('/view_cart');
    const proceedToCheckoutButton = page.locator('.btn.btn-default.check_out');
    await proceedToCheckoutButton.click();
    const registerLogin = page.getByRole('link', { name: 'Register / Login' });
    await registerLogin.click();
    expect(page.url()).toContain('/login');
    await pm.toLoginPage.signUpUser(randomName, randomEmail);
    await page.waitForTimeout(2000)
     await pm.toLoginPage.signUpForm(randomName, randomEmail, randomPassword, randomFirstName, randomLastName, randomCompany, randomAddress1, randomAddress2, randomState, randomCity, randomZipcode, randomMobileNumber);
    const continueButton = page.getByRole('link', { name: 'Continue' })
    await continueButton.click()
    await expect(page.locator('text= Logged in as ')).toBeVisible()
    pm.toProductPage.proceedTocheckoutToPayment(randomName,  randomCreditCard, '123', '12', '2025');
    await pm.toLoginPage.deleteAccount();
    

});












