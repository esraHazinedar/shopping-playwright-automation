import { Page, expect } from "@playwright/test";

export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }




    async verifyProductDetailsVisible(item: number) {
        const featureItmes = this.page.locator('.features_items');
        await expect(featureItmes).toBeVisible()
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
        await expect(this.page.getByText('All Products')).toBeVisible()


        const searchInputBox = this.page.getByPlaceholder('Search Product')
        await searchInputBox.click()
        await searchInputBox.fill(productName)
        const searchButton = this.page.locator('#submit_search')
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click()
        await expect(this.page.getByText('Searched Products')).toBeVisible()
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
        expect(matchFound).toBeTruthy();
    }


    async addFirstAndSecondProductToCart() {
        const allProducts = this.page.locator('.features_items .col-sm-4');
        const firstProduct = allProducts.nth(0);
        await firstProduct.hover();
        const firstAddToCartButton = firstProduct.getByText('Add to cart').first();
        await firstAddToCartButton.click();
        const continueShoppingButton = this.page.locator('button[data-dismiss="modal"]');
        await expect(continueShoppingButton).toBeVisible()
        await continueShoppingButton.click();


        const secondProduct = allProducts.nth(1);
        await secondProduct.hover();
        const secondAddToCartButton = secondProduct.getByText('Add to cart').first();
        await secondAddToCartButton.click();
        const viewCartButton = this.page.locator('.modal-content').locator('a[href="/view_cart"]');
        await viewCartButton.click();
        expect(this.page.url()).toContain('/view_cart');
        const cartItems = this.page.locator('.cart_info tbody tr');
        await expect(cartItems).toHaveCount(2);

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
        const viewCartButton = this.page.getByRole('link', { name: 'View Cart' });
        await expect(viewCartButton).toBeVisible()
        await viewCartButton.click();
        expect(this.page.url()).toContain('/view_cart');
        const cartItems = this.page.locator('.cart_info tbody tr');
        expect(cartItems).toHaveCount(1);
        const cartItem = cartItems.nth(0);
        const cartItemQuantity = await cartItem.locator('.cart_quantity button').textContent();
        expect(cartItemQuantity).toBe(quantity.toString());

    }


    async proceedTocheckoutToPayment(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {

        const cartLink = this.page.locator('.navbar-nav').getByText(' Cart');
        await expect(cartLink).toBeVisible()
        await cartLink.click()
        const proceedToCheckoutButton = this.page.locator('.btn.btn-default.check_out');
        await proceedToCheckoutButton.click()
        await expect(this.page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
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

    async verifyProductsPageLoaded() {
        await expect(this.page).toHaveURL(/products/);
        await expect(this.page.locator('.title.text-center')).toHaveText('All Products');
        await expect(this.page.locator('#accordian')).toBeVisible();
        await expect(this.page.locator('.brands_products')).toBeVisible();
    }

    async verifyProductListNonEmpty() {
        const productCards = this.page.locator('.features_items .col-sm-4');
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);
    }

    async searchProductExpectNoResults(term: string) {
        await expect(this.page.getByText('All Products')).toBeVisible();
        const searchInputBox = this.page.getByPlaceholder('Search Product');
        await searchInputBox.click();
        await searchInputBox.fill(term);
        const searchButton = this.page.locator('#submit_search');
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await expect(this.page.getByText('Searched Products')).toBeVisible();
        const productCards = this.page.locator('.features_items .col-sm-4');
        await expect(productCards).toHaveCount(0);
    }

    async searchWithEmptyTerm() {
        await expect(this.page.getByText('All Products')).toBeVisible();
        const searchButton = this.page.locator('#submit_search');
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await expect(this.page.locator('.title.text-center')).toBeVisible();
        await expect(this.page).not.toHaveURL(/error|500/);
    }

    async clearSearchAndSearchAgain(wrongTerm: string, correctTerm: string) {
        await expect(this.page.getByText('All Products')).toBeVisible();
        const searchInputBox = this.page.getByPlaceholder('Search Product');
        await searchInputBox.click();
        await searchInputBox.fill(wrongTerm);
        const searchButton = this.page.locator('#submit_search');
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await expect(this.page.getByText('Searched Products')).toBeVisible();
        await searchInputBox.clear();
        await searchInputBox.fill(correctTerm);
        await searchButton.click();
        await expect(this.page.getByText('Searched Products')).toBeVisible();
        const productCards = this.page.locator('.features_items .col-sm-4');
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);
    }

    async searchProductWithSpecialChars(term: string) {
        await expect(this.page.getByText('All Products')).toBeVisible();
        const searchInputBox = this.page.getByPlaceholder('Search Product');
        await searchInputBox.click();
        await searchInputBox.fill(term);
        const searchButton = this.page.locator('#submit_search');
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await expect(this.page.locator('.title.text-center')).toBeVisible();
        await expect(this.page).not.toHaveURL(/error|500/);
    }

    async addFirstProductToCartAndViewCart() {
        const allProducts = this.page.locator('.features_items .col-sm-4');
        const firstProduct = allProducts.first();
        await firstProduct.hover();
        const addToCartButton = firstProduct.getByText('Add to cart').first();
        await expect(addToCartButton).toBeVisible();
        await addToCartButton.click();
        const viewCartButton = this.page.locator('.modal-content a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 8000 });
        await viewCartButton.click();
        await expect(this.page).toHaveURL(/view_cart/);
    }

    async proceedToCheckoutClickRegisterLogin() {
        const proceedToCheckoutButton = this.page.locator('.btn.btn-default.check_out');
        await expect(proceedToCheckoutButton).toBeVisible();
        await proceedToCheckoutButton.click();
        const registerLoginLink = this.page.getByRole('link', { name: 'Register / Login' });
        await expect(registerLoginLink).toBeVisible();
        await registerLoginLink.scrollIntoViewIfNeeded();
        await registerLoginLink.click();
        await expect(this.page).toHaveURL(/login/);
    }

    async viewProductsByCategory(category: string, subCategory: string) {
        const categoryLink = this.page.locator('#accordian').getByText(category, { exact: true });
        await expect(categoryLink).toBeVisible();
        await categoryLink.click();
        const subCategoryLink = this.page.locator('#accordian').getByRole('link', { name: subCategory });
        await expect(subCategoryLink).toBeVisible();
        await subCategoryLink.click();
        await expect(this.page.getByRole('heading', { name: new RegExp(subCategory, 'i') })).toBeVisible();
        const productCards = this.page.locator('.features_items .col-sm-4');
        expect(await productCards.count()).toBeGreaterThan(0);
    }

    async viewAndCartBrandProducts(brandName: string) {
        const brandLink = this.page.locator('.brands_products').getByRole('link', { name: brandName });
        await brandLink.scrollIntoViewIfNeeded();
        await expect(brandLink).toBeVisible();
        await brandLink.click();
        await expect(this.page.getByRole('heading', { name: new RegExp(brandName, 'i') })).toBeVisible();
        const allProducts = this.page.locator('.features_items .col-sm-4');
        expect(await allProducts.count()).toBeGreaterThan(0);
        const firstProduct = allProducts.first();
        await firstProduct.hover();
        const addToCartButton = firstProduct.getByText('Add to cart').first();
        await expect(addToCartButton).toBeVisible();
        await addToCartButton.click();
        const viewCartButton = this.page.locator('.modal-content a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 8000 });
        await viewCartButton.click();
        await expect(this.page).toHaveURL(/view_cart/);
    }

    async addSearchedProductsToCart(productName: string) {
        await expect(this.page.getByText('All Products')).toBeVisible();
        const searchInputBox = this.page.getByPlaceholder('Search Product');
        await searchInputBox.click();
        await searchInputBox.fill(productName);
        const searchButton = this.page.locator('#submit_search');
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await expect(this.page.getByText('Searched Products')).toBeVisible();
        const firstResult = this.page.locator('.features_items .col-sm-4').first();
        await firstResult.hover();
        const addToCartButton = firstResult.getByText('Add to cart').first();
        await expect(addToCartButton).toBeVisible();
        await addToCartButton.click();
        const continueShoppingButton = this.page.locator('button[data-dismiss="modal"]');
        await expect(continueShoppingButton).toBeVisible();
        await continueShoppingButton.click();
    }

    async addReviewOnProduct(reviewerName: string, email: string, reviewText: string) {
        const viewProductButton = this.page.locator('.nav.nav-pills.nav-justified > li > a').first();
        await expect(viewProductButton).toBeVisible();
        await viewProductButton.click();
        await expect(this.page).toHaveURL(/product_details/);
        await this.page.getByText('Write Your Review').scrollIntoViewIfNeeded();
        await expect(this.page.getByText('Write Your Review')).toBeVisible();
        await this.page.locator('#name').fill(reviewerName);
        await this.page.locator('#email').fill(email);
        await this.page.locator('#review').fill(reviewText);
        await this.page.locator('#button-review').click();
        await expect(this.page.getByText('Thank you for your review.')).toBeVisible();
    }
}