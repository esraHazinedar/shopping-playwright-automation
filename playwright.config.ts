import { defineConfig, devices } from '@playwright/test';
import type{TestOptions} from './test-options';




/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  //we can add custom waittime
  //timeout:10000,
  //globalTimeout: 60000,
//we can add locator timeout here 
//expect:{
  //timeout:2000
//},
 
   expect:{
    timeout:5000,
    toMatchSnapshot: {maxDiffPixels:50}

   },
  testDir: './tests',
 
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 :  4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    // ['allure-playwright']
  
    ['html']
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */

     baseURL: 'https://automationexercise.com/',
   


    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    actionTimeout:20000,
    video:{
      mode: 'on',
      size: {width:1920, height:1080}
    },
    viewport: { width: 1920, height: 1080 }, // <-- Add this line
    launchOptions: {
        headless: true, // ensure browser is headed
    },
  },
  

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] ,
        baseURL: 'https://automationexercise.com/'
      },
      
      //fullyParallel: true
    },

    {
      name: 'prod',

      use: { ...devices['Desktop Firefox'] 
       , baseURL: 'https://automationexercise.com/'
      },
     
      fullyParallel: true
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], baseURL: 'https://automationexercise.com/' },
    },
    {
      name: 'productFullScreen',
      testMatch: 'contact.spec.ts',
      use: {
        viewport: {width:1920, height:1080}
      },
      
    },
    {
      name: 'mobile',
      testMatch:['testMobile.spec.ts', 'product.spec.ts','contact.spec.ts','login.spec.ts','home.spec.ts'],
      
      use:{

        ...devices['iPhone 13 Pro'],
       viewport: {width:400, height:800}
      }
    }

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
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  // webServer removed — automationexercise.com is an external site, not a locally-served app.
});
