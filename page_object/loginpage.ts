import { Page, expect } from '@playwright/test';
import { Locators } from '../selectors/locator';

export class LoginPage {
  readonly page: Page;
  private itemName: string = '';
  private itemIndex?: number;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async inputCredentials(email: string, password: string) {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
  }

  async triggerLoginButton() {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async assertURL(pageURL: string) {
    await expect(this.page).toHaveURL(pageURL);
  }

  async assertText(locator: string, text: string) {
    await expect(this.page.locator(locator)).toHaveText(text);
  }

  async clickLocatorWithText(locator: string, text: string) {
    await this.page.locator(locator, { hasText: text }).click({ force: true });
  }

  async validateLoadingIsNotVisible() {
    await expect(this.page.getByRole('status')).toBeHidden({ timeout: 20000 });
  }

  async inputText(locator: string, inputData: string) {
    await this.page.fill(locator, inputData);
    this.itemName = inputData;
  }

  async generateRandomNumber() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return randomNumber;
  }

  async validateMessageInAlertBox(message: string) {
    this.page.once('dialog', async dialog => {
      expect(dialog.message()).toBe(message);
      await dialog.accept();
    });
  }

  async clickLocator(locator: string) {
    await this.page.locator(locator).click();
  }

  async validateCreatedItem() {
    console.log(`Item Name: ${this.itemName}`);

    const rows = this.page.locator('tbody tr');
    const count = await rows.count();

    let foundIndex = -1;
    for (let i = 0; i < count; i++) {
      const cellText = await rows.nth(i).locator('td').nth(2).textContent();
      if (cellText?.trim() === this.itemName) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex === -1) throw new Error('Item code not found');

    await expect(rows.nth(foundIndex)).toBeVisible();
    await expect(rows.nth(foundIndex)).toContainText(this.itemName);
    this.itemIndex = foundIndex;
  }

  async validateTextIsNotVisible(text: string) {
    await expect(this.page.getByText(text)).not.toBeVisible();
  }

  async deleteItem() {
    await this.validateMessageInAlertBox('are you sure?');
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/delete') && resp.status() === 200),
      this.page.locator('tbody tr').nth(this.itemIndex!).locator(Locators.redButton).click(),
    ]);

  }
}

