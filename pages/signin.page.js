class SignInPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = 'input[name="username"]';
    this.passwordInput = 'input[name="password"]';
    this.loginButton = 'button[class*="orangehrm-login-button"]';
  }

  async openPage() {
    await this.page.goto(process.env.BASE_URL);
    return this.page;
  }

  async fillUsername(user) {
    await this.page.fill(this.usernameInput, user);
  }

  async fillPassword(password) {
    await this.page.fill(this.passwordInput, password);
  }

  async submitLogin() {
    await this.page.click(this.loginButton);
  }
}

module.exports = SignInPage;
