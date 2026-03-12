const { expect } = require("@playwright/test");
const selectors = require("./loginPage.selectors");

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.usernameInput = page.locator(selectors.usernameInput);
    this.passwordInput = page.locator(selectors.passwordInput);
    this.loginButton = page.locator(selectors.loginButton);
    this.flashMessage = page.locator(selectors.flashMessage);
    this.logoutButton = page.locator(selectors.logoutButton);
    this.loginForm = page.locator(selectors.loginForm);
  }

  // PUBLIC_INTERFACE
  async goto() {
    /** Navigates to the login page. */
    await this.page.goto("/login");
    await expect(this.loginForm).toBeVisible();
  }

  // PUBLIC_INTERFACE
  async login(username, password) {
    /** Fills credentials and submits the login form. */
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // PUBLIC_INTERFACE
  async assertFlashContains(text) {
    /** Asserts the flash banner contains the provided text. */
    await expect(this.flashMessage).toBeVisible();
    await expect(this.flashMessage).toContainText(text);
  }

  // PUBLIC_INTERFACE
  async assertLoggedIn() {
    /** Asserts user is logged in by checking for logout button and success flash. */
    await expect(this.logoutButton).toBeVisible();
    await this.assertFlashContains("You logged into a secure area!");
  }

  // PUBLIC_INTERFACE
  async assertLoggedOut() {
    /** Asserts user is logged out by checking for login form presence. */
    await expect(this.loginForm).toBeVisible();
  }
}

module.exports = { LoginPage };
