import { Page, expect } from '@playwright/test';
export class LoginSignUpPage {

    readonly page: Page
    constructor(page: Page) {

        this.page = page;
    }
    /***
     * Sign Up Form 
     * name: string
     * email: string
     * password: string
     * firstName: string
     * lastName: string
     * company: string
     * address1: string
     * address2: string
     * state: string
     * city: string
     * zipCode: string
     * mobileNumber: string 
     *
     */

    async signUpForm(name: string, email: string, password: string, firstName: string, lastName: string, company: string, address1: string, address2: string, state: string, city: string, zipCode: string, mobileNumber: string) {


        await expect(this.page.locator('text=ENTER ACCOUNT INFORMATION')).toBeVisible()
        const passwordInputBox = this.page.getByRole('textbox', { name: 'Password' })
        await passwordInputBox.click()
        await passwordInputBox.fill(password)
        const daysDropdown = this.page.locator('#days')
        await daysDropdown.selectOption('10')
        const monthsDropdown = this.page.locator('#months')
        await monthsDropdown.selectOption('5')
        const yearsDropdown = this.page.locator('#years')
        await yearsDropdown.selectOption('1990')
        const newsletterCheckbox = this.page.locator('#newsletter')
        await newsletterCheckbox.check()
        const offersCheckbox = this.page.locator('#optin')
        await offersCheckbox.check()
        const firstNameInputBox = this.page.getByRole('textbox', { name: 'First Name' })
        await firstNameInputBox.click()
        await firstNameInputBox.fill(firstName)
        const lastNameInputBox = this.page.getByRole('textbox', { name: 'Last Name' })
        await lastNameInputBox.click()
        await lastNameInputBox.fill(lastName)
        const companyInputBox = this.page.getByRole('textbox', { name: 'Company', exact: true })
        await companyInputBox.click()
        await companyInputBox.fill(company)
        const address1InputBox = this.page.locator('#address1')
        await address1InputBox.click()
        await address1InputBox.fill(address1)
        const address2InputBox = this.page.locator('#address2')
        await address2InputBox.click()
        await address2InputBox.fill(address2)
        const countryDropdown = this.page.locator('#country')
        await countryDropdown.selectOption('Canada')
        const stateInputBox = this.page.getByRole('textbox', { name: 'State' })
        await stateInputBox.click()
        await stateInputBox.fill(state)
        const cityInputBox = this.page.getByRole('textbox', { name: 'City * Zipcode *' })
        await cityInputBox.isEnabled()
        await cityInputBox.click()
        await cityInputBox.fill(city)
        const zipCodeInputBox = this.page.locator('#zipcode')
        await zipCodeInputBox.click()
        await zipCodeInputBox.fill(zipCode)
        const mobileNumberInputBox = this.page.getByRole('textbox', { name: 'Mobile Number' })
        await mobileNumberInputBox.click()
        await mobileNumberInputBox.fill(mobileNumber)
        const createAccountButton = this.page.getByRole('button', { name: 'Create Account' })
        await createAccountButton.click()



    }


    async loginExistingUser(email: string, password: string) {
        const loginForm = this.page.locator('.login-form')
        const emailInputBox = loginForm.getByPlaceholder('Email Address')
        const passwordInputBox = loginForm.getByPlaceholder('Password')
        const loginButton = loginForm.getByRole('button', { name: 'Login' })
        await emailInputBox.click()
        await emailInputBox.fill(email)
        await passwordInputBox.click()
        await passwordInputBox.fill(password)
        await loginButton.click()
    };



    async signUpUser(name: string, email: string) {
        expect(this.page.getByText('New User Signup!')).toBeVisible()

        const signUpForm = this.page.locator('.signup-form');
        const nameInputBox = signUpForm.getByPlaceholder('Name')
        const emailInputBox = signUpForm.getByPlaceholder('Email Address')
        const signUpButton = signUpForm.getByRole('button', { name: 'Signup' })
        await nameInputBox.click()
        await nameInputBox.fill(name)
        await emailInputBox.click()
        await emailInputBox.fill(email)
        await signUpButton.click()
    }


    async deleteAccount() {
        const continueButton = this.page.getByRole('link', { name: 'Continue' })
        await continueButton.click()
        await expect(this.page.locator('text= Logged in as ')).toBeVisible()
        await this.page.getByRole('link', { name: ' Delete Account' }).click()
        await continueButton.click()
    }













}