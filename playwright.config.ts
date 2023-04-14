import {defineConfig, devices} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    retries: process.env.CI ? 1 : 0,
    use: {
        // TODO: Eventually want this to be true for when running on the pipeline, set to false for testing
        headless: !process.env.CI,
        viewport: {width: 1920, height: 1080},
        ignoreHTTPSErrors: true,
        video: 'on-first-retry',
        baseURL: 'http://localhost:3001',
        trace: 'on-first-retry',
    },
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },

        // {
        //     name: 'firefox',
        //     use: {...devices['Desktop Firefox']},
        // },
        //
        // {
        //     name: 'webkit',
        //     use: {...devices['Desktop Safari']},
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   reuseExistingServer: false,
    //   // Default timeout of 30 seconds
    //   timeout: 30 * 1000
    // }
    webServer: {
        command: 'PORT=3001 npm run start',
        port: 3001,
        reuseExistingServer: false,
    },
});
