import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page_object/loginpage';
import { Locators } from '../../selectors/locator';

test.describe('Test Item page', () => {
    test('Navigate to Item page', async ({page}) => {
        const loginPage = new LoginPage(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await loginPage.goto();
            await loginPage.inputCredentials(email, password);
            await loginPage.triggerLoginButton();
            await loginPage.validateLoadingIsNotVisible();
            //Assert Dashboard
            await loginPage.assertURL('/');
            await loginPage.assertText('h1', 'Home');
        });
        await test.step('When I click the Item on navigation bar', async () => {
            await loginPage.clickLocatorWithText(Locators.navigationLink, 'Items');
        });
        await test.step('Then I should be navigated to Item page', async () => {
            await loginPage.validateLoadingIsNotVisible();
            await loginPage.assertURL('/items');
            await loginPage.assertText('h4', 'Item List');
        });
    });

    test('Create Item', async ({page}) => {
        const loginPage = new LoginPage(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await loginPage.goto();
            await loginPage.inputCredentials(email, password);
            await loginPage.triggerLoginButton();
            await loginPage.validateLoadingIsNotVisible();
            //Assert Dashboard
            await loginPage.assertURL('/');
            await loginPage.assertText('h1', 'Home');
        });
        await test.step('And I navigate on Item page', async () => {
            await loginPage.clickLocatorWithText(Locators.navigationLink, 'Items');
            //Validate I am on Item page
            await loginPage.validateLoadingIsNotVisible();
            await loginPage.assertURL('/items');
            await loginPage.assertText('h4', 'Item List');
        });
        await test.step('When I click the Add item button', async () => {
            await loginPage.clickLocatorWithText(Locators.primaryButton, 'Add Item');
            //Validate I am on Create Item page
            await loginPage.assertURL('/item/create');
            await loginPage.assertText('h4', 'Create Item');
        });
        await test.step('And I input the item details', async () => {
            const getRandomNumber = await loginPage.generateRandomNumber();
            await loginPage.inputText(Locators.inputItemName, `Sample Item ${getRandomNumber}`);
            await loginPage.inputText(Locators.inputItemCode, `Sample Code ${getRandomNumber}`);
        });
        await test.step('And I click the Save button', async () => {
            await loginPage.validateMessageInAlertBox('Item was created successfully.');
            await loginPage.clickLocatorWithText(Locators.primaryButton, 'Save');
        });
        await test.step('And I move back to item page', async () => {
            await loginPage.clickLocator(Locators.backButton);
            //Validate I am on Item page
            await loginPage.validateLoadingIsNotVisible();
            await loginPage.assertURL('/items');
            await loginPage.assertText('h4', 'Item List');
        });
        await test.step('Then the created item is visible on the table', async () => {
            await loginPage.validateTextIsNotVisible('No item to fetch.');
            await loginPage.validateCreatedItem();

            //Delete Created Item
            await loginPage.deleteItem();
        });
        
    })

})