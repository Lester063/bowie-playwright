import { test, expect } from '@playwright/test';
import { PageObject } from '../../page_object/pageObject';
import { Locators } from '../../selectors/locator';
test.describe.configure({ mode: 'serial' });
test.describe('Test Item page', () => {
    let itemCode: string;
    test('Navigate to Item page', async ({ page }) => {
        const pageObject = new PageObject(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await pageObject.goto();
            await pageObject.inputCredentials(email, password);
            await pageObject.triggerLoginButton();
            await pageObject.validateLoadingIsNotVisible();
            //Assert Dashboard
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
        await test.step('When I click the Item on navigation bar', async () => {
            await pageObject.clickLocatorWithText(Locators.navigationLink, 'Items');
        });
        await test.step('Then I should be navigated to Item page', async () => {
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
        });
    });

    test('Create Item', async ({ page }) => {
        const pageObject = new PageObject(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await pageObject.goto();
            await pageObject.inputCredentials(email, password);
            await pageObject.triggerLoginButton();
            await pageObject.validateLoadingIsNotVisible();
            //Assert Dashboard
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
        await test.step('And I navigate on Item page', async () => {
            await pageObject.clickLocatorWithText(Locators.navigationLink, 'Items');
            //Validate I am on Item page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
        });
        await test.step('When I click the Add item button', async () => {
            await pageObject.clickLocatorWithText(Locators.primaryButton, 'Add Item');
            //Validate I am on Create Item page
            await pageObject.assertURL('/item/create');
            await pageObject.assertText('h4', 'Create Item');
        });
        await test.step('And I input the item details', async () => {
            const getRandomNumber = await pageObject.generateRandomNumber();
            itemCode = `Sample Code ${getRandomNumber}`;
            await pageObject.inputText(Locators.inputItemName, `Sample Item ${getRandomNumber}`);
            await pageObject.inputText(Locators.inputItemCode, itemCode);
        });
        await test.step('And I click the Save button', async () => {
            await pageObject.validateMessageInAlertBox('Item was created successfully.');
            await pageObject.clickLocatorWithText(Locators.primaryButton, 'Save');
        });
        await test.step('And I move back to item page', async () => {
            await pageObject.clickLocator(Locators.backButton);
            //Validate I am on Item page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
        });
        await test.step('Then the created item is visible on the table', async () => {
            await pageObject.validateTextIsNotVisible('No item to fetch.');
            await pageObject.getItemIndex(itemCode);
            await pageObject.validateItemIsVisible(itemCode);

            //Delete Created Item
            //await pageObject.deleteItem();
        });
    })

    test('Edit Item', async ({ page }) => {
        const pageObject = new PageObject(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await pageObject.goto();
            await pageObject.inputCredentials(email, password);
            await pageObject.triggerLoginButton();
            await pageObject.validateLoadingIsNotVisible();
            //Assert Dashboard
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
        await test.step('And I navigate on Item page', async () => {
            await pageObject.clickLocatorWithText(Locators.navigationLink, 'Items');
            //Validate I am on Item page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
            await pageObject.validateTextIsNotVisible('No item to fetch.');
        });
        await test.step('When I click the edit item button', async () => {
            await pageObject.getItemIndex(itemCode);
            await pageObject.clickEditItemButton();
            //Validate I am on Create Item page
            await pageObject.assertText('h4', 'Edit Item');
        });
        await test.step('And I input the new item details', async () => {
            const getRandomNumber = await pageObject.generateRandomNumber();
            itemCode = `Updated Sample Code ${getRandomNumber}`;
            await pageObject.inputText(Locators.inputItemName, `Updated Sample Item ${getRandomNumber}`);
            await pageObject.inputText(Locators.inputItemCode, itemCode);
        });
        await test.step('And I click the Save button', async () => {
            await pageObject.validateMessageInAlertBox('Data has been updated successfully.');
            await pageObject.clickLocatorWithText(Locators.primaryButton, 'Save');
        });
        await test.step('Then the updated item is visible on the table', async () => {
            //Validate I am on Item page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
            await pageObject.validateTextIsNotVisible('No item to fetch.');
            //Validate Item
            await pageObject.getItemIndex(itemCode);
            await pageObject.validateItemIsVisible(itemCode);
        });
    });

    test('Request Item', async ({ page }) => {
        const pageObject = new PageObject(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await pageObject.goto();
            await pageObject.inputCredentials(email, password);
            await pageObject.triggerLoginButton();
            await pageObject.validateLoadingIsNotVisible();
            //Assert Dashboard
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
        await test.step('And I navigate on Item page', async () => {
            await pageObject.clickLocatorWithText(Locators.navigationLink, 'Items');
            //Validate I am on Item page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
            await pageObject.validateTextIsNotVisible('No item to fetch.');
        });
        await test.step('When I click the request item button', async () => {
            await pageObject.getItemIndex(itemCode);
            const responsePromise = pageObject.waitRequest('/requests');
            await pageObject.clickRequestItemButton();
            await responsePromise;
            await pageObject.validateMessageInAlertBox('Request sent successfully.');
        });
        await test.step('And I navigate to My Requests page', async () => {
            const responsePromise = pageObject.waitRequest('/userrequest');
            pageObject.clickLocatorWithText(Locators.navigationLink, 'My Requests');
            await responsePromise;
            //Validate I am on My Requests page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/myrequests');
            await pageObject.assertText('h4', 'My Requests');
            await pageObject.validateTextIsNotVisible('No item to fetch.');
        });
        await test.step('Then the requested item is visible on the table', async () => {
            //Validate Requested item
            await pageObject.getItemIndex(itemCode);
            await pageObject.validateItemIsVisible(itemCode);
        });
    })

    test('Delete Item', async ({ page }) => {
        const pageObject = new PageObject(page);
        const email = process.env.TEST_USER_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;
        await test.step('Given I am logged in', async () => {
            await pageObject.goto();
            await pageObject.inputCredentials(email, password);
            await pageObject.triggerLoginButton();
            await pageObject.validateLoadingIsNotVisible();
            //Assert Dashboard
            //await pageObject.assertURL('/');
            await pageObject.assertText('h1', 'Home');
        });
        await test.step('And I navigate on Item page', async () => {
            await pageObject.clickLocatorWithText(Locators.navigationLink, 'Items');
            //Validate I am on Item page
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
            await pageObject.validateTextIsNotVisible('No item to fetch.');
        });
        await test.step('When I click the delete item button', async () => {
            await pageObject.getItemIndex(itemCode);
            const responsePromise = pageObject.waitRequest('/delete');
            page.on('dialog', async (dialog) => {
                const message = dialog.message();
                if (message.includes('are you sure?')) {
                    await dialog.accept();
                } else if (message.includes('Pending request for this item will be automatically closed, are you sure you want to delete the item?')) {
                    await dialog.accept();
                } else if (message.includes('Item has been deleted successfully.')) {
                    await dialog.accept();
                }
            });
            await pageObject.clickDeleteItemButton();
            await responsePromise;
        });
        await test.step('Then the deleted item is not visible on the table', async () => {
            const responsePromise = pageObject.waitRequest('/items');
            await page.goto('/items');
            await responsePromise;
            await pageObject.validateLoadingIsNotVisible();
            await pageObject.assertURL('/items');
            await pageObject.assertText('h4', 'Item List');
            await pageObject.validateTextIsNotVisible('No item to fetch.');
            //Validate deleted item is not visible
            await pageObject.validateTextIsNotVisible(itemCode);
        });

    })

})