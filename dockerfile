FROM mcr.microsoft.com/playwright:v1.51.0-jammy

# Create app directory
COPY package*.json ./
WORKDIR /usr/src/app

# Copy project files
COPY . .

# Install dependencies
RUN npm ci

# Ensure all browsers are installed (chromium, firefox, webkit)
RUN npx playwright install --with-deps

# Give execution permission to node_modules binaries and the test runner script
RUN chmod -R 777 node_modules
RUN chmod +x ./run_pw_tests.sh

# Default command (can be overridden in docker-compose or Jenkinsfile)
CMD ["bash", "./../test_pw_web.sh", "open_allure=false", "clear_old_results=true", "browser=chromium", "headless=true", "tag=smoke"]
