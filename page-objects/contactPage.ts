import {Page,expect} from "@playwright/test";

export class ContactPage{
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }



async fillContactForm(name: string, email: string, filePath: string) {
    expect  (this.page.getByText('Get In Touch')).toBeVisible()
    const form = this.page.locator('#form-section');
     await form.scrollIntoViewIfNeeded();
    const nameInputBox = form.getByPlaceholder('Name')
    await nameInputBox.click()
    await nameInputBox.fill(name)

    const emailInputBox = form.getByPlaceholder('Email')
    await emailInputBox.click()
    await emailInputBox.fill(email)
    const chooseFileInput = form.getByRole('button', { name: 'Choose File' })
   // await chooseFileInput.click()
    await chooseFileInput.setInputFiles(filePath)
    const submitButton = this.page.locator('input[name="submit"]')
     await submitButton.click();
   
    await submitButton.click();
    this.page.on('dialog', dialog => dialog.accept());
}
}


