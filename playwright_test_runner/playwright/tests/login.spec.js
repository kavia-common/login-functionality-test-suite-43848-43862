const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { getLoginData } = require("../utils/testData");
const { feature, appName } = require("../utils/testMeta");

test.describe(`${appName} :: ${feature}`, () => {
  test("valid login should succeed and show success message", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const data = getLoginData();

    test.info().annotations.push({ type: "feature", description: feature });
    test.info().annotations.push({ type: "site", description: "https://the-internet.herokuapp.com/login" });

    await loginPage.goto();
    await loginPage.login(data.valid.username, data.valid.password);

    await loginPage.assertLoggedIn();

    // Additional sanity check: URL ends with /secure after successful login
    await expect(page).toHaveURL(/\/secure$/);
  });

  for (const invalidCase of getLoginData().invalid) {
    test(`invalid login should fail: ${invalidCase.name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      test.info().annotations.push({ type: "feature", description: feature });
      test.info().annotations.push({ type: "case", description: invalidCase.name });

      await loginPage.goto();
      await loginPage.login(invalidCase.username, invalidCase.password);

      await loginPage.assertFlashContains(invalidCase.expectedFlashContains);

      // Ensure we didn't get logged in
      await expect(loginPage.logoutButton).toHaveCount(0);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
