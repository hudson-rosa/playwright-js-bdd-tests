# Running the Playwright tests from this project

As you can see in the sections below, you have flexible ways to trigger the Cucumber tests.
However, the script files `run_pw_web_tests.sh`, `run_pw_api_tests.sh`, and `run_pw_android_tests.sh` allows to run the tests easily by passing the correct arguments to the expected variables OPEN_ALLURE, HEADLESS, BROWSER, TAG, etc.

For the Web tests, we can have these command args:

```bash
  # Examples:
  ./test_pw_web.sh browser=chromium headless=false open_allure=true tag='@web'
  ./test_pw_web.sh browser=chromium headless=true open_allure=false tag='@web'
  ./test_pw_web.sh browser=firefox headless=false open_allure=true tag='@authentication'
  ./test_pw_web.sh browser=webkit headless=false open_allure=true tag='@negative'
```

For the API tests, we can have these command args:

```bash
  # Examples:
  ./test_pw_api.sh open_allure=true tag="@api"
  ./test_pw_api.sh open_allure=false tag="@post-new-user"
```

For the Android Mobile tests, we can have these command args:

```bash
  # Examples:
  ./test_pw_mobile.sh platform=android open_allure=true tag='@smoke-android'
  ./test_pw_mobile.sh platform=ios open_allure=false tag='@sum-computation'
```

---

## Generating new tests

To easily generate the code for the scenarios, use the following command passing the desired URL from the target application:

```bash
  npx playwright codegen https://opensource-demo.orangehrmlive.com/
```

---

## Running the BDD scenarios using the PW commands

```bash
PWDEBUG=1 npx cucumber-js
```

Run in non-headless mode for debugging.

```bash
  npx cucumber-js --tags @sign-in
  npx cucumber-js --tags @negative
  npx cucumber-js --tags @regression
```

Run specific scenarios as tagged

```bash
  npx cucumber-js --tags '@sign-in or @invalid-sign-in'
```

Run multiple tags.

If you need to specify the scenarios based on the steps path:

```bash
  npx cucumber-js features/sign-in.feature --require steps/signInSteps.js
```

### Running locally from Dockerfile

Running the tests using Dockerfile:

```bash
  docker build -t playwright-tests .
  docker run --rm playwright-tests
```

Running the tests using docker-compose.yml:

```bash
  docker-compose build

  # To run on all browsers from the project root
  docker-compose up --abort-on-container-exit

  # To run forcing rebuild
  docker-compose up --build --abort-on-container-exit

  # OR:
  npm run docker-compose-run-tests
```

You can customise the test run variables such as OPEN_ALLURE, HEADLESS, BROWSER, TAG to send with the command `docker-compose up`. To make it simpler, combine with the command defined in the `package.json > scripts`:

```bash
  # Example:
  OPEN_ALLURE=false BROWSER=chromium HEADLESS=false TAG='@sign-in' npm run docker-compose-run-tests

  # OR
  OPEN_ALLURE=false BROWSER=chromium HEADLESS=false TAG='@smoke' npm run docker-compose up
```

To remove all containers and volumes:

```bash
  docker-compose down -v

  # OR:
  npm run docker-remove-all
```

## Allure Report

```bash
  npm run allure:generate-report && npm run allure:open
```

Generate a JSON report.

---

## CLEANING OLD SESSIONS FROM NATIVE APP TESTS

- To clean the old sessions:

```bash
  adb -s 25261FDF60045T shell pm clear io.appium.android.apis
  adb -s 25261FDF60045T uninstall io.appium.uiautomator2.server
  adb -s 25261FDF60045T uninstall io.appium.uiautomator2.server.test
```

- To manually install the app on a device:

```bash
  adb -s 25261FDF60045T install -r ./app-dist/ApiDemos-debug.apk
```

---

## Running the specs - THE BASICS FOR PLAYWRIGHT TESTING

Inside that directory, you can run several commands:

```bash
  npx playwright test
```

Runs the end-to-end tests.

```bash
  npx playwright test --ui
```

Starts the interactive UI mode.

```bash
  npx playwright test --project=chromium
```

Runs the tests only on Desktop Chrome.

```bash
  npx playwright test example
```

Runs the tests in a specific file.

```bash
  npx playwright test --debug
```

Runs the tests in debug mode.

```bash
  npx playwright codegen
```

Auto generate tests with Codegen.

We suggest that you begin by typing:

```bash
  npx playwright test

  npx playwright test tests/signInOrangeHrm.spec.js
```

And check out the following files:

- ./tests/example.spec.js - Example end-to-end test
- ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
- ./playwright.config.js - Playwright Test configuration

### Reports

To open last HTML report run:

```bash
  npx playwright show-report
```

### Using AI Log Analyser

To have accurate analysis on existing failures from the generated Allure Report logs, run this command:

```bash
  node analyzeWithGPT.js result.json
```

# APPIUM

To inspect your mobile app to extract locators for page objects implementation on your tests, first download the Appium Inspector from this official Appium-Inspector repository and install it on your local machine:

  https://github.com/appium/appium-inspector/releases/ 

- If you are working on MacOS, after installing the Appium-Inspector, the system it may block this application by default for security reasons. In this case, skip the quarantine verification by running this command:

```bash
  sudo xattr -rd com.apple.quarantine /Applications/Appium\ Inspector.app
```

Now run the appium server locally:

```bash
  npx appium -p 4723
```

- If you are struggling to use the Appium Inspector locally installed, you also can use an online version:

  https://inspector.appiumpro.com/



## Issues with Appium

1️⃣ Unsupported Node version warning
- Appium 3.x requires Node >= 22.12.0 (or 20.19.0, 24+)

### Solution: Upgrade Node

Using Homebrew:
```bash
  brew install node@22

  echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> /Users/<PC_NAME>/.zshrc
  # Or simply:
  echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc

  brew link --overwrite node@22
```

Or with NVM:

```bash
  nvm install 22.20.0
  nvm use 22.20.0
```

Then verify and install the desired Appium version for the project:

```bash
  node -v
  # should be >= 22.+++

  npm install appium@latest
  appium -v 
  # should be > 3.0.2
```

Finally, install the drivers for Android and iOS:

```bash
  npx appium driver uninstall uiautomator2
  npx appium driver uninstall xcuitest
  npx appium driver install uiautomator2
  npx appium driver install xcuitest

  # to check them:
  npx appium driver list --installed
```

Make sure your Homebrew is installed:
```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Android Studio - Full IDE
```bash
  brew install --cask android-studio
```

Or, just the command line tools:
```bash
  brew install --cask android-commandlinetools
  brew list --cask android-commandlinetools
```

Export the variables for Android SDK:
```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
  export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH
  echo $ANDROID_HOME
  echo $ANDROID_SDK_ROOT
```

Create the folder and install the SDK components:
```bash
  mkdir -p ~/Library/Android/sdk
  ls -l ~/Library/Android/sdk

  sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "platforms;android-34" "build-tools;34.0.0" "emulator" "system-images;android-34;google_apis;x86_64"

  adb --version
  sdkmanager --list
```

Test if the app can be installed manually on a real Android device:
```bash
  adb install -r /Users/qa/Projects/test_automation/playwright-js-bdd-tests/app-dist/ApiDemos-debug.apk
  adb shell am start -n io.appium.android.apis/.ApiDemos
```
