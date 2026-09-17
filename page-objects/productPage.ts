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





    async searchProduct(searchTerm: string) {
        await expect(this.page.getByText('All Products')).toBeVisible({ timeout: 15000 });
        const searchInputBox = this.page.getByPlaceholder('Search Product');
        await searchInputBox.click();
        await searchInputBox.fill(searchTerm);
        const searchButton = this.page.locator('#submit_search');
        await searchButton.waitFor({ state: 'visible' });
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            searchButton.click(),
        ]);
        await expect(this.page.getByText(/Searched Products/i)).toBeVisible({ timeout: 30000 });
        const productCards = this.page.locator('.features_items .col-sm-4');
        await expect(productCards.first()).toBeVisible({ timeout: 20000 });
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);
    }


    async addFirstAndSecondProductToCart() {
        await this.page.waitForLoadState('networkidle');
        const allProducts = this.page.locator('.features_items .col-sm-4');
        const firstProduct = allProducts.nth(0);
        await firstProduct.hover();
        const firstAddToCartButton = firstProduct.getByText('Add to cart').first();
        await firstAddToCartButton.click();
        const cartModal = this.page.locator('#cartModal');
        await expect(cartModal).toBeVisible({ timeout: 15000 });
        const continueShoppingButton = cartModal.locator('button[data-dismiss="modal"]');
        await expect(continueShoppingButton).toBeVisible({ timeout: 8000 });
        await continueShoppingButton.click();
        await expect(cartModal).not.toBeVisible({ timeout: 8000 });

        const secondProduct = allProducts.nth(1);
        await secondProduct.hover();
        const secondAddToCartButton = secondProduct.getByText('Add to cart').first();
        await secondAddToCartButton.click();
        const viewCartButton = this.page.locator('#cartModal a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 30000 });
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
        const productDetails = this.page.locator('.product-details');
        await expect(productDetails).toBeVisible({ timeout: 20000 });
        expect(this.page.url()).toContain(`/product_details/${productIndex + 1}`);
        const profuctQuantityBox = this.page.locator('#quantity');
        await profuctQuantityBox.click();
        await profuctQuantityBox.fill(quantity.toString());
        const addToCartButton = this.page.locator('button[class="btn btn-default cart"]');
        await this.page.waitForLoadState('networkidle');
        await addToCartButton.click();
const viewCartButton = this.page.locator('#cartModal a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 30000 });
        await viewCartButton.click();
        await expect(this.page).toHaveURL(/view_cart/);
        const cartItems = this.page.locator('.cart_info tbody tr');
        await expect(cartItems).toHaveCount(1, { timeout: 10000 });
        const cartItem = cartItems.nth(0);
        const cartItemQuantity = await cartItem.locator('.cart_quantity button').textContent();
        expect(cartItemQuantity).toBe(quantity.toString());

    }


    async proceedTocheckoutToPayment(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {

        const cartLink = this.page.locator('.navbar-nav').getByText(' Cart');
        await expect(cartLink).toBeVisible()
        await cartLink.click()
        // Wait for cart page to fully load
        await this.page.waitForLoadState('networkidle');
        const proceedToCheckoutButton = this.page.locator('.btn.btn-default.check_out');
        await expect(proceedToCheckoutButton).toBeVisible({ timeout: 10000 });
        await proceedToCheckoutButton.click()
        // Wait for checkout page to load completely
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        // Wait for checkout page to load by checking for Address Details heading visibility
        await expect(this.page.getByRole('heading', { name: 'Address Details' })).toBeVisible({ timeout: 15000 });
        await expect(this.page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible({ timeout: 15000 });
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
        await expect(productCards.first()).toBeVisible({ timeout: 10000 });
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
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            searchButton.click(),
        ]);
        await expect(this.page.getByText(/Searched Products/i)).toBeVisible({ timeout: 30000 });
        const productCards = this.page.locator('.features_items .col-sm-4');
        await expect(productCards).toHaveCount(0, { timeout: 10000 });
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
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            searchButton.click(),
        ]);
        await expect(this.page.getByText(/Searched Products/i)).toBeVisible({ timeout: 30000 });
        await searchInputBox.clear();
        await searchInputBox.fill(correctTerm);
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            searchButton.click(),
        ]);
        const productCards = this.page.locator('.features_items .col-sm-4');
        await expect(productCards.first()).toBeVisible({ timeout: 15000 });
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
        // Navigate to product detail page — no hover overlay needed, more reliable
        const viewFirstProductButton = this.page.locator('.nav.nav-pills.nav-justified > li > a').first();
        await expect(viewFirstProductButton).toBeVisible({ timeout: 15000 });
        await viewFirstProductButton.click();
        // toHaveURL retries across the navigation — longer timeout covers slow loads under concurrency
        await expect(this.page).toHaveURL(/product_details/, { timeout: 20000 });
        // networkidle ensures page scripts have settled before we interact (avoids modal not triggering under load)
        await this.page.waitForLoadState('networkidle');
        const addToCartButton = this.page.locator('button[class="btn btn-default cart"]');
        await expect(addToCartButton).toBeVisible({ timeout: 10000 });
        await addToCartButton.click();
        const viewCartButton = this.page.locator('#cartModal a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 30000 });
        await viewCartButton.click();
        await expect(this.page).toHaveURL(/view_cart/, { timeout: 15000 });
    }

    async proceedToCheckoutClickRegisterLogin() {
        const proceedToCheckoutButton = this.page.locator('.btn.btn-default.check_out');
        await expect(proceedToCheckoutButton).toBeVisible();
        await proceedToCheckoutButton.click();
        // Wait for modal to close and page to stabilize
        const cartModal = this.page.locator('#cartModal');
        await expect(cartModal).not.toBeVisible({ timeout: 10000 });
        // Wait for page to stabilize after checkout button click
        await this.page.waitForLoadState('networkidle');
        // Add small delay to ensure page is fully interactive
        await this.page.waitForTimeout(1000);
        // Use the correct link text " Signup / Login" (with leading space)
        const registerLoginLink = this.page.getByRole('link', { name: ' Signup / Login' });
        await expect(registerLoginLink).toBeVisible({ timeout: 15000 });
        await registerLoginLink.scrollIntoViewIfNeeded({ timeout: 10000 });
        await registerLoginLink.click();
        await expect(this.page).toHaveURL(/login/);
    }

    async viewProductsByCategory(category: string, subCategory: string) {
        const categoryLink = this.page.locator('#accordian').getByText(category, { exact: true });
        await expect(categoryLink).toBeVisible();
        await categoryLink.click();
        const subCategoryLink = this.page.locator('#accordian').getByRole('link', { name: subCategory });
        await expect(subCategoryLink).toBeVisible({ timeout: 30000 });
        await subCategoryLink.click();
        await expect(this.page.getByRole('heading', { name: new RegExp(subCategory, 'i') })).toBeVisible({ timeout: 10000 });
        const productCards = this.page.locator('.features_items .col-sm-4');
        await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    }

    async viewAndCartBrandProducts(brandName: string) {
        const brandLink = this.page.locator('.brands_products').getByRole('link', { name: brandName });
        await brandLink.scrollIntoViewIfNeeded();
        await expect(brandLink).toBeVisible();
        await brandLink.click();
        await expect(this.page.getByRole('heading', { name: new RegExp(brandName, 'i') })).toBeVisible({ timeout: 20000 });
        const allProducts = this.page.locator('.features_items .col-sm-4');
        await expect(allProducts.first()).toBeVisible({ timeout: 15000 });
        const firstProduct = allProducts.first();
        await firstProduct.scrollIntoViewIfNeeded();
        await firstProduct.hover();
        const addToCartButton = firstProduct.getByText(/add to cart/i).first();
        await expect(addToCartButton).toBeVisible({ timeout: 8000 });
        await addToCartButton.click();
        const cartModal = this.page.locator('#cartModal');
        await expect(cartModal).toBeVisible({ timeout: 15000 });
        const viewCartButton = this.page.locator('#cartModal a[href="/view_cart"]');
        await viewCartButton.waitFor({ state: 'visible', timeout: 30000 });
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
        await expect(this.page.getByText(/Searched Products/i)).toBeVisible({ timeout: 60000 });
        const firstResult = this.page.locator('.features_items .col-sm-4').first();
        await expect(firstResult).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
        await firstResult.scrollIntoViewIfNeeded();
        await firstResult.hover();
        const addToCartButton = firstResult.getByText('Add to cart').first();
        await expect(addToCartButton).toBeVisible({ timeout: 12000 });
        await addToCartButton.click();
        const cartModal = this.page.locator('#cartModal');
        await expect(cartModal).toBeVisible({ timeout: 20000 });
        const continueShoppingButton = cartModal.locator('button[data-dismiss="modal"]');
        await expect(continueShoppingButton).toBeVisible({ timeout: 8000 });
        await continueShoppingButton.click();
        await expect(cartModal).not.toBeVisible({ timeout: 8000 });
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