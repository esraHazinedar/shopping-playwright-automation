import {test, expect} from '../test-options';
import { PageManager } from '../page-objects/pageManager';  
import {faker} from '@faker-js/faker';



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


test('Verify all products and product detail page', async ({ page,productPage }) => {
    const pageManager = new PageManager(page);
    expect(page.getByText('All Products')).toBeVisible()
    await productPage.toProductPage.verifyProductDetailsVisible(1);
   
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


test('Search Product', async ({productPage }) => {
   
    await productPage.toProductPage.searchProduct('Tshirt');


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

test('Add Products to Cart', async ({productPage }) => {
    
    await productPage.toProductPage.addFirstAndSecondProductToCart()


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

test('Add Quantity of Product in Cart', async ({ productPage }) => {

    await productPage.toProductPage.addProductToCartByQuantity(3,4);


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
test('Register, Login and Place Order', async ({ productPage,page}) => {

   const pm = new PageManager(page);

// =====================
// 🔥 Test Data (Faker)
// =====================
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

// =====================
// 🛍️ Add product to cart
// =====================
const allProducts = page.locator('.features_items .col-sm-4');
const firstProduct = allProducts.first();

await firstProduct.hover();

const addToCartButton = firstProduct.getByText('Add to cart').first();
await expect(addToCartButton).toBeVisible();
await addToCartButton.click();

// =====================
// 🛒 View cart modal
// =====================
const viewCartButton = page.locator('.modal-content a[href="/view_cart"]');

await expect(viewCartButton).toBeVisible();

// screenshot AFTER stable state
await viewCartButton.screenshot({
  path: 'screenshots/viewcartButton.png',
});

await viewCartButton.click();

// URL assertion (more stable than string check)
await expect(page).toHaveURL(/view_cart/);

// =====================
// 💳 Proceed to checkout
// =====================
const proceedToCheckoutButton = page.locator('.btn.btn-default.check_out');
await expect(proceedToCheckoutButton).toBeVisible();
await proceedToCheckoutButton.click();

// =====================
// 🔐 Login/Register
// =====================
const registerLogin = page.getByRole('link', {
  name: 'Register / Login',
});

await expect(registerLogin).toBeVisible();
await registerLogin.scrollIntoViewIfNeeded();
await registerLogin.click();

await expect(page).toHaveURL(/login/);

// =====================
// 🧾 Sign up
// =====================
await pm.toLoginPage.signUpUser(randomName, randomEmail);

await pm.toLoginPage.signUpForm(
  randomName,
  randomEmail,
  randomPassword,
  randomFirstName,
  randomLastName,
  randomCompany,
  randomAddress1,
  randomAddress2,
  randomState,
  randomCity,
  randomZipcode,
  randomMobileNumber
);

// =====================
// ▶️ Continue
// =====================
const continueButton = page.getByRole('link', { name: 'Continue' });

await expect(continueButton).toBeVisible();
await continueButton.click();

// IMPORTANT: no sleep, use assertion instead
await expect(page.getByText(/Logged in as/i)).toBeVisible();

// =====================
// 💳 Checkout + Payment
// =====================
await productPage.toProductPage.proceedTocheckoutToPayment(
  randomName,
  randomCreditCard,
  '123',
  '12',
  '2025'
);
// =====================
// 🧹 Delete account
// =====================
await pm.toLoginPage.deleteAccount();


});
/**
 * Test Case 8: Verify All Products and product detail page
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Products' button
5. Verify user is navigated to ALL PRODUCTS page successfully
6. The products list is visible
7. Click on 'View Product' of first product
8. User is landed to product detail page
9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
 */
test('Verify All Porducts and product detail page',async({productPage})=>{
 

     
 
   await  productPage.toProductPage.verifyProductsPageLoaded();



})
















