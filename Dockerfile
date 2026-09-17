# Match the @playwright/test version in package-lock.json.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /app

# CI disables local server reuse and Git hooks.
# This image runs Playwright; it does not need the Cypress binary.
ENV CI=true \
    HUSKY=0 \
    CYPRESS_INSTALL_BINARY=0 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Allure 2 needs Java to generate its HTML report.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Cache dependency installation until the package files change.
# The existing npm prepare hook references this Husky installer.
COPY package.json package-lock.json ./
COPY .husky/install.mjs ./.husky/install.mjs
RUN npm ci --include=dev --no-audit --no-fund

# Includes app/, serve.json, the tests, POM, config, and runner.
COPY . .

# Fail the build if the installed test package and browser image diverge.
RUN node -e "if (require('@playwright/test/package.json').version !== '1.63.0') throw new Error('Update the Docker image tag to match Playwright')"

# Playwright starts the application through its webServer configuration.
CMD ["node", "scripts/run-docker-tests.cjs"]
