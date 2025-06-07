import { test, expect } from '@playwright/test';
import { PageObject } from '../../page_object/pageObject';
import { Locators } from '../../selectors/locator';

test.describe('Login', () => {
    test('Navigate to login page', async ({page}) => {
        const pageObject = new PageObject(page);
        await test.step('Given I navigate to login page', async () => {
            await pageObject.goto();
        });
        await test.step('Then I should see the login page', async () => {
            //Assert URL
            await pageObject.assertURL('/login');
            await pageObject.assertText('h1', 'Login');
        })
    });

    test('User should be able to login', async ({page}) => {
        const pageObject = new PageObject(page);
        const email = 'lester@gmail.com';
        const password = 'lester123';
        await test.step('Given I navigate to login page', async () => {
            await pageObject.goto();
        });
        await test.step('When I enter my credential', async () => {
            await pageObject.inputCredentials(email, password);
        });
        await test.step('And I click the login button', async () => {
            await pageObject.triggerLoginButton();
        });
        await test.step('Then I should be able to login successfully', async () => {
            await pageObject.validateLoadingIsNotVisible();
            //Assert Dashboard
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
    });

    // test('Message Invalid Credentials should be displayed', async ({page}) => {
    //     const pageObject = new PageObject(page);
    //     await test.step('Given I navigate to login page', async () => {
    //         await pageObject.goto();
    //     });
    //     await test.step('When I enter my incorrect credential', async () => {
    //         await pageObject.inputCredentials('invalid@gmail.com', 'password');
    //     });
    //     await test.step('And I click the login button', async () => {
    //         await pageObject.triggerLoginButton();
    //     });
    //     await test.step('Then an error message should be displayed', async () => {
    //         await pageObject.validateLoadingIsNotVisible();
    //         //Assert Dashboard
    //         await pageObject.assertURL('/login');
    //         await pageObject.assertText(Locators.errorMessage, 'Invalid Credentials');
    //     });
    // });
});

test.describe('Logout', () => {
    test('I should be able to Logout', async ({page}) => {
        const pageObject = new PageObject(page);
        const email = 'lester@gmail.com';
        const password = 'lester123';
        await test.step('Given I am logged in' , async () => {
            await pageObject.goto();
            await pageObject.inputCredentials(email, password);
            await pageObject.triggerLoginButton();
            await pageObject.validateLoadingIsNotVisible();
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
        await test.step('When I click the Logout button' , async () => {
            await pageObject.clickLocatorWithText(Locators.navigationLink, 'Logout');
        });
        await test.step('Then I should be navigated to login page ' , async () => {
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/login');
            await pageObject.assertText('h1', 'Login');
        });
    })
})