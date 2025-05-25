import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page_object/loginpage';
import { Locators } from '../../selectors/locator';

test.describe('Login', () => {
    test('Navigate to login page', async ({page}) => {
        const loginPage = new LoginPage(page);
        await test.step('Given I navigate to login page', async () => {
            await loginPage.goto();
        });
        await test.step('Then I should see the login page', async () => {
            //Assert URL
            await loginPage.assertURL('/login');
            await loginPage.assertRoleWithText(Locators.mainHeading, 'Login');
        })
    });

    test('User should be able to login', async ({page}) => {
        const loginPage = new LoginPage(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I navigate to login page', async () => {
            await loginPage.goto();
        });
        await test.step('When I enter my credential', async () => {
            await loginPage.inputCredentials(email, password);
        });
        await test.step('And I click the login button', async () => {
            await loginPage.triggerLoginButton();
        });
        await test.step('Then I should be able to login successfully', async () => {
            await loginPage.validateLoadingIsNotVIsible();
            //Assert Dashboard
            await loginPage.assertURL('/');
            await loginPage.assertRoleWithText(Locators.mainHeading, 'Home');
        });
    });

    test('Message Invalid Credentials should be displayed', async ({page}) => {
        const loginPage = new LoginPage(page);
        await test.step('Given I navigate to login page', async () => {
            await loginPage.goto();
        });
        await test.step('When I enter my incorrect credential', async () => {
            await loginPage.inputCredentials('invalid@gmail.com', 'password');
        });
        await test.step('And I click the login button', async () => {
            await loginPage.triggerLoginButton();
        });
        await test.step('Then an error message should be displayed', async () => {
            await loginPage.validateLoadingIsNotVIsible();
            //Assert Dashboard
            await loginPage.assertURL('/login');
            await loginPage.assertRoleWithText(Locators.errorMessage, 'Invalid Credentials');
        });
    });
});

test.describe('Logout', () => {
    test('I should be able to Logout', async ({page}) => {
        const loginPage = new LoginPage(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in' , async () => {
            await loginPage.goto();
            await loginPage.inputCredentials(email, password);
            await loginPage.triggerLoginButton();
            await loginPage.assertURL('/login');
            await loginPage.assertRoleWithText(Locators.mainHeading, 'Home');
        });
        await test.step('When I click the Logout button' , async () => {
            await loginPage.clickLocator(Locators.navigationLink, 'Logout');
        });
        await test.step('Then I should be navigated to login page ' , async () => {
            await loginPage.assertURL('/login');
            await loginPage.assertRoleWithText(Locators.mainHeading, 'Login');
        });
    })
})