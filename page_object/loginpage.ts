import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

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

  async triggerLoginButton () {
    await this.page.getByRole('button', {name:'Login'}).click();
  }

  async assertURL(pageURL: string) {
    await expect(this.page).toHaveURL(pageURL);
  }

  async assertRoleWithText(locator: string, text: string) {
    await expect(this.page.locator(locator)).toHaveText(text);
  }

  async clickLocator(locator: string, text: string) {
    await this.page.locator(locator, {hasText: text}).click();
  }

  async validateLoadingIsNotVIsible() {
    await expect(this.page.getByRole('status')).toBeHidden();
  }
}

