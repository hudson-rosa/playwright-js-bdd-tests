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

# Give execution permission to node_modules binaries
RUN chmod -R 777 node_modules

# Default command (can be overridden in docker-compose or Jenkinsfile)
CMD ["npm", "run", "test:all-browsers:smoke"]
