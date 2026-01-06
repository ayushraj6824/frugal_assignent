const { test, expect } = require('@playwright/test');

test.describe('Intelligent Registration System Automation', () => {

    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.goto('/');
    });

    test('Flow A: Negative Scenario - Missing Required Field', async ({ page }) => {
        console.log(`Page URL: ${page.url()}`);
        console.log(`Page Title: ${await page.title()}`);

        // Fill form partially
        await page.fill('#firstName', 'Ayush');
        // Skipped Last Name
        await page.fill('#email', 'ayush@example.com');
        await page.fill('#phone', '9876543210');
        await page.check('input[value="male"]');

        // Attempt Submit (Button likely disabled, but we can try to force or check validation state)
        // Since our logic disables the button, we should check if the button is disabled or if error is shown on blur

        // Trigger validation by blurring the empty last name field if we interacted with it, 
        // but here we didn't touch it. Let's focus and blur it to trigger the error.
        await page.focus('#lastName');
        await page.blur('#lastName');

        // Validation
        const lastNameError = page.locator('#lastNameError');
        await expect(lastNameError).toBeVisible();
        await expect(lastNameError).toHaveText('Last name is required');

        const submitBtn = page.locator('#submitBtn');
        await expect(submitBtn).toBeDisabled();

        // Verify error highlighting
        await expect(page.locator('#lastName')).toHaveClass(/error/);

        // Capture Screenshot
        await page.screenshot({ path: 'test-results/error-state.png', fullPage: true });
    });

    test('Flow B: Positive Scenario - Successful Registration', async ({ page }) => {
        // Fill all fields
        await page.fill('#firstName', 'Ayush');
        await page.fill('#lastName', 'Kumar');
        await page.fill('#email', 'ayush.valid@gmail.com');
        await page.fill('#phone', '+91 9876543210');
        await page.fill('#age', '25');
        await page.check('input[value="male"]');
        await page.fill('#address', '123 Tech Park');

        // Dropdowns
        await page.selectOption('#country', 'India');
        await page.selectOption('#state', 'Karnataka');
        await page.selectOption('#city', 'Bangalore');

        // Passwords
        await page.fill('#password', 'StrongPass123!');
        await page.fill('#confirmPassword', 'StrongPass123!');

        // Terms
        await page.check('#terms');

        // Submit
        const submitBtn = page.locator('#submitBtn');
        await expect(submitBtn).toBeEnabled();
        await submitBtn.click();

        // Validate Success
        const successModal = page.locator('#successModal');
        await expect(successModal).toBeVisible();
        await expect(successModal).toContainText('Registration Successful!');

        // Capture Screenshot
        await page.screenshot({ path: 'test-results/success-state.png' });
    });

    test('Flow C: Form Logic Validation', async ({ page }) => {
        // 1. Cascading Dropdowns
        const country = page.locator('#country');
        const state = page.locator('#state');
        const city = page.locator('#city');

        await expect(state).toBeDisabled();
        await expect(city).toBeDisabled();

        await country.selectOption('USA');
        await expect(state).toBeEnabled();

        // Verify States for USA
        const stateOptions = await state.locator('option').allInnerTexts();
        expect(stateOptions).toContain('California');
        expect(stateOptions).toContain('New York');

        await state.selectOption('California');
        await expect(city).toBeEnabled();

        // 2. Password Strength
        const password = page.locator('#password');
        const strengthText = page.locator('#strengthText');

        await password.fill('abc');
        await expect(strengthText).toHaveText('Weak');

        await password.fill('abc12345');
        await expect(strengthText).toHaveText('Medium');

        await password.fill('StrongPass123!');
        await expect(strengthText).toHaveText('Strong');

        // 3. Confirm Password Mismatch
        await password.fill('Password123');
        await page.locator('#confirmPassword').fill('Password456');
        await expect(page.locator('#confirmPasswordError')).toBeVisible();

        // 4. Submit Disabled
        await expect(page.locator('#submitBtn')).toBeDisabled();
    });
});
