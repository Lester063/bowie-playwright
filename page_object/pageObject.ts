import { Page, expect } from '@playwright/test';
import { Locators } from '../selectors/locator';

export class PageObject {
  readonly page: Page;
  private itemIndex?: number;

  constructor(page: Page) {
    this.page = page;
  }

  //Navigate to login page
  async goto() {
    await this.page.goto('/login');
  }

  //Input credentials on email and password
  async inputCredentials(email: string, password: string) {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
  }

  //Click button with inner name Login
  async triggerLoginButton() {
    //await this.page.getByRole('button', { name: 'Login' }).click();
    await Promise.all([
    this.page.waitForResponse(resp =>
      resp.url().includes('/login') && resp.status() === 200
    ),
    this.page.getByRole('button', { name: 'Login' }).click()
  ]);
  }

  //Validate that the current page URL matches the URL passed on a parameter.
  async assertURL(pageURL: string) {
    await expect(this.page).toHaveURL(pageURL);
  }

  //Validate text on the locator
  async assertText(locator: string, text: string) {
    await expect(this.page.locator(locator)).toHaveText(text);
  }

  //Click locator with text based on the parameter passed
  async clickLocatorWithText(locator: string, text: string) {
    await this.page.locator(locator, { hasText: text }).click({ force: true });
  }

  //Validate loading icon is not visible on the page
  async validateLoadingIsNotVisible() {
    await expect(this.page.getByRole('status')).toBeHidden({ timeout: 20000 });
  }

  //Input text on the field based on the locator passed on parameter
  async inputText(locator: string, inputData: string) {
    await this.page.fill(locator, inputData);
  }

  //Generate random number
  async generateRandomNumber() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return randomNumber;
  }

  //Validate the message on the pop up alert box, and will click OK button
  async validateMessageInAlertBox(message: string) {
    this.page.once('dialog', async dialog => {
      expect(dialog.message()).toBe(message);
      await dialog.accept();
    });
  }

  //Click anything either button or link or what, depends on the locator passed on the parameter
  async clickLocator(locator: string) {
    await this.page.locator(locator).click();
  }

  //Validate that text is visible on the table row based on index
  async validateItemIsVisible(itemCode: string) {
    await expect(this.page.locator('tbody tr').nth(this.itemIndex!)).toBeVisible();
    await expect(this.page.locator('tbody tr').nth(this.itemIndex!)).toContainText(itemCode);
  }

  //Validate that text is not visible on the page
  async validateTextIsNotVisible(text: string) {
    await expect(this.page.getByText(text)).not.toBeVisible();
  }

  //Click Delete Item button on Item table list
  async clickDeleteItemButton() {
    this.page.locator('tbody tr').nth(this.itemIndex!).locator(Locators.redButton).click();
  }

  //Click Edit Item button on Item table list
  async clickEditItemButton() {
    this.page.locator('tbody tr').nth(this.itemIndex!).locator(Locators.primaryButton).first().click();
  }

  //Click the Request Item button on Item table list
  async clickRequestItemButton() {
    await this.validateMessageInAlertBox('are you sure?');
    this.page.locator('tbody tr').nth(this.itemIndex!).locator(Locators.primaryButton).last().click();
  }

  //Get the item index on the table based on the item code passed on the parameter
  async getItemIndex(itemCode: string) {
    console.log(`Item Code: ${itemCode}`);

    const rows = this.page.locator('tbody tr');
    const count = await rows.count();

    let foundIndex = -1;
    for (let i = 0; i < count; i++) {
      const cellText = await rows.nth(i).locator('td').nth(2).textContent();
      if (cellText?.trim() === itemCode) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex === -1) throw new Error('Item code not found');

    this.itemIndex = foundIndex;
  }

  //Need to wait the response every action with API request
  async waitRequest(path: string) {
    return this.page.waitForResponse(resp =>
      resp.url().includes(path) && resp.status() === 200
    );
  }

}

