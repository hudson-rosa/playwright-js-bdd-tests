# Running the specs

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

    npx playwright test signInOrangeHrm 
  ```

And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration

## Reports

To open last HTML report run:

```bash
  npx playwright show-report
```

------------------

# Running the BDD scenarios

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

  ## Reports

  ```bash
    npx cucumber-js --format json:report.json
  ```
  Generate a JSON report.
