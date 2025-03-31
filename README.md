Inside that directory, you can run several commands:

  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.


We suggest that you begin by typing:

    npx playwright test

    npx playwright test signInOrangeHrm 

And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration

------------------

BDD Execution

  PWDEBUG=1 npx cucumber-js
    Run in non-headless mode for debugging.
  
  npx cucumber-js --tags @sign-in
    Run a specific scenario.

  npx cucumber-js --format json:report.json
    Generate a JSON report.
