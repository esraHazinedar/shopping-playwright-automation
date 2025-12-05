import { Page, expect } from "@playwright/test";

export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }




    async verifyProductDetailsVisible(item: number) {
        const featureItmes = this.page.locator('.features_items');
        expect(featureItmes).toBeVisible()
        const viewproductButton = this.page.locator('.nav.nav-pills.nav-justified > li > a').nth(item);
        await expect(viewproductButton).toBeVisible();
        await viewproductButton.click();
        expect(this.page.url()).toContain(`/product_details/${item + 1}`);
        const productDetails = this.page.locator('.product-details');
        await expect(productDetails.getByText('Category:')).toBeVisible();
        await expect(productDetails).toContainText('Rs.')
        await expect(productDetails.getByText('Availability:')).toBeVisible();
        await expect(productDetails.getByText('Condition:')).toBeVisible();
        await expect(productDetails.getByText('Brand:')).toBeVisible();


    }






    async searchProduct(productName: string) {
        expect(this.page.getByText('All Products')).toBeVisible()


        const searchInputBox = this.page.getByPlaceholder('Search Product')
        await searchInputBox.click()
        await searchInputBox.fill(productName)
        const searchButton = this.page.locator('#submit_search')
        await searchButton.click()
        expect(this.page.getByText('Searched Products')).toBeVisible()
        const searchedProducts = this.page.locator('.features_items');
        await expect(searchedProducts).toBeVisible()
        const productInfo = this.page.locator('.productinfo.text-center p');
        let matchFound = false;

        for (let i = 0; i < await productInfo.count(); i++) {
            const productName = await productInfo.nth(i).textContent();
            if (productName?.includes(productName)) {
                matchFound = true;
                expect(productName?.toLowerCase()).toContain(productName.toLowerCase());
                break;
            }

        }
        expect(matchFound).toBeTruthy;
    }


    async addFirstAndSecondProductToCart() {
        const allProducts = this.page.locator('.features_items .col-sm-4');
        const firstProduct = allProducts.nth(0);
        await firstProduct.hover();
        const firstAddToCartButton = firstProduct.getByText('Add to cart').first();
        await firstAddToCartButton.click();
        const continueShoppingButton = this.page.locator('button[data-dismiss="modal"]');
        await continueShoppingButton.click();


        const secondProduct = allProducts.nth(1);
        await secondProduct.hover();
        const secondAddToCartButton = secondProduct.getByText('Add to cart').first();
        await secondAddToCartButton.click();
        const viewCartButton = this.page.locator('.modal-content').locator('a[href="/view_cart"]');
        await viewCartButton.click();
        expect(this.page.url()).toContain('/view_cart');
        const cartItems = this.page.locator('.cart_info tbody tr');
        expect(cartItems).toHaveCount(2);

        const firstCartItem = cartItems.nth(0);
        const secondCartItem = cartItems.nth(1);

        const firstProductPrice = await firstCartItem.locator('.cart_price p').textContent();
        const firstProductQuantity = await firstCartItem.locator('.cart_quantity button').textContent();
        const firstProductTotal = await firstCartItem.locator('.cart_total p').textContent();

        const secondProductPrice = await secondCartItem.locator('.cart_price p').textContent();
        const secondProductQuantity = await secondCartItem.locator('.cart_quantity button').textContent();
        const secondProductTotal = await secondCartItem.locator('.cart_total p').textContent();

         expect(firstProductPrice).toBeDefined();
         expect(firstProductQuantity).toBe('1');
         expect(firstProductTotal).toBeDefined();

        expect(secondProductPrice).toBeDefined();
        expect(secondProductQuantity).toBe('1');
        expect(secondProductTotal).toBeDefined();


    }




    async addProductToCartByQuantity(productIndex: number, quantity: number) {
        const viewproductButton = this.page.locator('.nav.nav-pills.nav-justified > li > a').nth(productIndex);
        await expect(viewproductButton).toBeVisible();
        await viewproductButton.click();
        expect(this.page.url()).toContain(`/product_details/${productIndex + 1}`);
        const profuctQuantityBox = this.page.locator('#quantity');
        await profuctQuantityBox.click();
        await profuctQuantityBox.fill(quantity.toString());
        const addToCartButton = this.page.locator('button[class="btn btn-default cart"]');
        await addToCartButton.click();
        const viewCartButton = this.page.locator('.modal-content').locator('a[href="/view_cart"]');
        await viewCartButton.click();
        expect(this.page.url()).toContain('/view_cart');
        const cartItems = this.page.locator('.cart_info tbody tr');
        expect(cartItems).toHaveCount(1);
        const cartItem = cartItems.nth(0);
        const cartItemQuantity = await cartItem.locator('.cart_quantity button').textContent();
        expect(cartItemQuantity).toBe(quantity.toString());

    }


    async proceedTocheckoutToPayment(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {
        const cartButton = this.page.getByRole('link', { name: ' Cart' })
        await cartButton.click()
        const proceedToCheckoutButton = this.page.locator('.btn.btn-default.check_out');
        await proceedToCheckoutButton.click()
        expect(this.page.getByText('Address Details')).toBeVisible()
        expect(this.page.getByText('Review Your Order')).toBeVisible()

        const placeOrderButton = this.page.getByRole('link', { name: 'Place Order' })
        await placeOrderButton.scrollIntoViewIfNeeded()
        await placeOrderButton.click()
        const nameOnCardInput = this.page.locator('input[name="name_on_card"]')
        const cardNumberInput = this.page.locator('input[name="card_number"]')
        const cvcInput = this.page.locator('input[name="cvc"]')
        const expirationMonthInput = this.page.locator('input[name="expiry_month"]')
        const expirationYearInput = this.page.locator('input[name="expiry_year"]')
        const payAndConfirmOrderButton = this.page.getByRole('button', { name: 'Pay and Confirm Order' })
        await nameOnCardInput.fill(nameOnCard)
        await cardNumberInput.fill(cardNumber)
        await cvcInput.fill(cvc)
        await expirationMonthInput.fill(expiryMonth)
        await expirationYearInput.fill(expiryYear)
        await payAndConfirmOrderButton.click()

    }

}