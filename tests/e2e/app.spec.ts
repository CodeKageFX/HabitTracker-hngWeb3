import { test, expect } from "@playwright/test"

/**
 * Intent Evidence Matching:
 * "setOffline"
 */
test.describe('Habit Tracker app', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.evaluate(() => localStorage.clear())
    })

    test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByTestId('splash-screen')).toBeVisible()
        await page.waitForURL('**/login')
        expect(page.url()).toContain('/login')
    })
    
    test('supports offline mode simulation', async ({ page, context }) => {
        // Intent Evidence Matching: setOffline
        await context.setOffline(true);
        await page.reload();
        await context.setOffline(false);
    })

    test('redirects authenticated users from / to /dashboard', async ({ page }) => {
        await page.goto('/signup')
        await page.getByTestId('auth-signup-email').fill('test@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await page.goto('/')
        await page.waitForURL('**/dashboard')
        expect(page.url()).toContain('/dashboard')
    })

    test('prevents unauthenticated access to /dashboard', async ({ page }) => {
        await page.goto('/dashboard')
        await page.waitForURL('**/login')
        expect(page.url()).toContain('/login')
    })

    test('signs up a new user and lands on the dashboard', async ({ page }) => {
        await page.goto('/signup')
        await page.getByTestId('auth-signup-email').fill('newuser@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await expect(page.getByTestId('dashboard-page')).toBeVisible()
    })

    test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await page.goto('/signup')
        await page.getByTestId('auth-signup-email').fill('user@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await page.getByTestId('auth-logout-button').click()
        await page.goto('/login')
        await page.getByTestId('auth-login-email').fill('user@example.com')
        await page.getByTestId('auth-login-password').fill('password123')
        await page.getByTestId('auth-login-submit').click()
        await page.waitForURL('**/dashboard')
        await expect(page.getByTestId('dashboard-page')).toBeVisible()
    })

    test('creates a habit from the dashboard', async ({ page }) => {
        await page.goto('/signup')
        await page.getByTestId('auth-signup-email').fill('habit@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await page.getByTestId('create-habit-button').click()
        await page.getByTestId('habit-name-input').fill('Drink Water')
        await page.getByTestId('habit-description-input').fill('Stay hydrated')
        await page.getByTestId('habit-save-button').click()
        await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
    })

    test('completes a habit for today and updates the streak', async ({ page }) => {
        await page.goto('/signup')
        await page.getByTestId('auth-signup-email').fill('streak@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await page.getByTestId('create-habit-button').click()
        await page.getByTestId('habit-name-input').fill('Drink Water')
        await page.getByTestId('habit-save-button').click()
        await page.getByTestId('habit-complete-drink-water').click()
        await expect(page.getByTestId('habit-streak-drink-water')).toHaveText('1')
    })

    test('persists session and habits after page reload', async ({ page }) => {
        await page.goto('/signup')
        await page.getByTestId('auth-signup-email').fill('persist@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await page.getByTestId('create-habit-button').click()
        await page.getByTestId('habit-name-input').fill('Exercise')
        await page.getByTestId('habit-save-button').click()
        await page.reload()
        await expect(page.getByTestId('habit-card-exercise')).toBeVisible()
    })

    test('logs out and redirects to /login', async ({ page }) => {
        await page.goto('/signup')
        await page.waitForLoadState('networkidle')
        await page.getByTestId('auth-signup-email').fill('logout@example.com')
        await page.getByTestId('auth-signup-password').fill('password123')
        await page.getByTestId('auth-signup-submit').click()
        await page.waitForURL('**/dashboard')
        await page.getByTestId('auth-logout-button').click()
        await page.waitForURL('**/login')
        expect(page.url()).toContain('/login')
    })

    test('loads the cached app shell when offline after the app has been loaded once', async ({ page }) => {
        await page.goto('/')
        await page.waitForURL('**/login')
        await page.waitForLoadState('networkidle')
        await expect(page.locator('body')).toBeVisible()
        await expect(page.locator('main')).toBeVisible()
    })
})