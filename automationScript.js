const { chromium } = require('playwright'); // Import Playwright

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Step 1: Navigate to the portal
        await delay(3000);
        await page.goto('https://www.saucedemo.com/v1/');
        console.log('Navigated to Saucedemo portal.');

        // Step 2: Login with correct credentials
        await delay(3000);
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.waitForSelector('.inventory_list');
        console.log('Logged in successfully.');

        // Step 3: Apply filter - High to Low
        await delay(3000);
        await page.selectOption('.product_sort_container', { label: 'Price (high to low)' });
        console.log('Applied "Price (high to low)" filter.');

        // Step 4: Add 4 products to the cart
        const productsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light'
        ];

        for (const productName of productsToAdd) {
            await addProductToCart(page, productName);
        }

        // Step 4: Remove 2 products from the cart
        const productsToRemove = [
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket'
        ];

        for (const productName of productsToRemove) {
            await removeProductFromCart(page, productName);
        }

        // Step 5: Click on Cart icon
        await delay(3000);
        await page.click('.shopping_cart_link');
        await page.waitForSelector('.cart_list');
        console.log('Navigated to the cart.');

        // Step 6: Remove 1 product from the cart
        const additionalProductToRemove = 'Sauce Labs Backpack';
        await removeProductFromCart(page, additionalProductToRemove);

        // Step 7: Click on Checkout - Enter details
        await delay(3000);
        await page.click('a.btn_action.checkout_button');
        await page.waitForSelector('#checkout_info_container');
        await page.fill('#first-name', 'Barath');
        await page.fill('#last-name', 'kumar');
        await page.fill('#postal-code', '624169');
        console.log('Entered checkout information.');

        // Step 8: Click on Continue
        await delay(3000);
        await page.click('#checkout_info_container > div > form > div.checkout_buttons > input');
        await page.waitForSelector('.summary_info');
        console.log('Proceeded to checkout overview.');

        // Step 9: Click on Finish
        await delay(3000);
        await page.click('#checkout_summary_container > div > div.summary_info > div.cart_footer > a.btn_action.cart_button');
        await page.waitForSelector('.complete-header');
        console.log('Finished the checkout process.');

        // Step 10: Verify 'ThankYou' message using assertion
        await delay(3000);
        const thankYouMessage = await page.textContent('.complete-header');
        if (thankYouMessage.includes('THANK YOU FOR YOUR ORDER')) {
            console.log('Test Passed: Thank You message found!');
        } else {
            console.error('Test Failed: Thank You message not found!');
        }

    } catch (error) {
        console.error('An error occurred during the automation process:', error);
    } finally {
        await browser.close();
    }
})();

// Function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to add a product to the cart by product name
async function addProductToCart(page, productName) {
    await delay(3000); // Add delay before adding a product
    const productSelector = `//div[text()='${productName}']/ancestor::div[@class='inventory_item']`;
    const product = await page.locator(productSelector);
    
    if (await product.isVisible()) {
        const addToCartButton = product.locator('button');
        await addToCartButton.click();
        console.log(`Added "${productName}" to the cart.`);
    } else {
        console.error(`Product "${productName}" not found.`);
    }
}

// Function to remove a product from the cart by product name
async function removeProductFromCart(page, productName) {
    await delay(3000); // Add delay before removing a product
    const cartItemSelector = `//div[text()='${productName}']/ancestor::div[@class='cart_item']`;
    const cartItem = await page.locator(cartItemSelector);
    
    if (await cartItem.isVisible()) {
        const removeButton = cartItem.locator('button');
        await removeButton.click();
        console.log(`Removed "${productName}" from the cart.`);
    } else {
        console.error(`Product "${productName}" not found in the cart.`);
    }
}