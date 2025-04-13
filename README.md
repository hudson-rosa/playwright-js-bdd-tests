# Running the Playwright tests from this project

As you can see in the sections below, you have flexible ways to trigger the Cucumber tests.
However, the script file `run_pw_tests.sh` allows to run the tests easily by passing the correct arguments to the expected variables OPEN_ALLURE, HEADLESS, BROWSER, TAG.

  ```bash
    # Example:
    ./run_pw_tests.sh open_allure=false browser=webkit headless=true tag='@authentication'
  ```


## Running the specs

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

### Reports

To open last HTML report run:

```bash
  npx playwright show-report
```

------------------

## Running the BDD scenarios

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

  ### Allure Report

  ```bash
    npm run generate:allure-report && npm run open:allure-report
  ```
  Generate a JSON report.
