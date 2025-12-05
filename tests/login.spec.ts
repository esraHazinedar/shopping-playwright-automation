import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';
test.beforeEach(async ({ page }) => {

    await page.goto('/')
    expect(page).toHaveURL('https://automationexercise.com/')

})


/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Signup / Login' button
5. Verify 'New User Signup!' is visible
6. Enter name and email address
7. Click 'Signup' button
8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
9. Fill details: Title, Name, Email, Password, Date of birth
10. Select checkbox 'Sign up for our newsletter!'
11. Select checkbox 'Receive special offers from our partners!'
12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
13. Click 'Create Account button'
14. Verify that 'ACCOUNT CREATED!' is visible
15. Click 'Continue' button
16. Verify that 'Logged in as username' is visible
17. Click 'Delete Account' button
18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
 */


test('Register a new user', async ({ page }) => {
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


    await pm.navigateTo.navigateToLoginSignUpPage();
    await pm.toLoginPage.signUpUser(randomFirstName, randomEmail);
    await pm.toLoginPage.signUpForm(randomName, randomEmail, randomPassword, randomFirstName, randomLastName, randomCompany, randomAddress1, randomAddress2, randomState, randomCity, randomZipcode, randomMobileNumber);
    await pm.toLoginPage.deleteAccount();
});

/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Signup / Login' button
5. Verify 'Login to your account' is visible
6. Enter correct email address and password
7. Click 'login' button
8. Verify that 'Logged in as username' is visible
9. Click 'Logout' button
10. Verify that user is navigated to login page
 */
test('Login with Existing User', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo.navigateToLoginSignUpPage();
    await pm.toLoginPage.loginExistingUser('testpp@test.com', '12345');
    expect(page.locator('text= Logged in as ')).toBeVisible()
    await page.getByRole('link', { name: ' Logout' }).click()
    await expect(page).toHaveURL('https://automationexercise.com/login')
});


/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Signup / Login' button
5. Verify 'Login to your account' is visible
6. Enter incorrect email address and password
7. Click 'login' button
8. Verify error 'Your email or password is incorrect!' is visible
 */

test('Negative Login Test', async ({ page }) => {

    expect(page.getByText('Login to your account')).toBeVisible()
    const pm = new PageManager(page);
    await pm.navigateTo.navigateToLoginSignUpPage();
    await pm.toLoginPage.loginExistingUser('testpp@test.com', '12349');
    await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible()

});


/**
 * 1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Signup / Login' button
5. Verify 'New User Signup!' is visible
6. Enter name and already registered email address
7. Click 'Signup' button
8. Verify error 'Email Address already exist!' is visible
 */

test('Register User With and Existing Email', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo.navigateToLoginSignUpPage();
    await pm.toLoginPage.signUpUser('Ezra', 'test@test.com')
    await expect(page.locator('text=Email Address already exist!')).toBeVisible()


});


