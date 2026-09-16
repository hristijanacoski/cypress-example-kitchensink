# ToDo QA Practical Exercise - Playwright and TypeScript

This fork adds automated tests for the Kitchen Sink ToDo application using Playwright, TypeScript, Page Object Model (POM), and Allure reporting.

- [Repository](https://github.com/hristijanacoski/cypress-example-kitchensink)
- [Gherkin test plan](docs/todo.feature)
- [Playwright tests](tests/todo.spec.ts)
- [Page object](pages/ToDoPage.ts)
- [Test configuration](playwright.config.ts)
- [Bug reports](https://github.com/hristijanacoski/cypress-example-kitchensink/issues)

## Requirements

- Git.
- Node.js 24.15.0 or a newer 24.x release, with npm. The repository's `.node-version` selects Node 24; `package.json` specifies the supported minimum versions.
- Java 8 or newer for the Allure 2 report generator. Configure `JAVA_HOME` to point to the Java installation and make Java available on `PATH`.

Check your tools:

```shell
node --version
npm --version
java -version
```

## Installation

Clone this fork and install the dependencies already recorded in the lockfile:

```shell
git clone https://github.com/hristijanacoski/cypress-example-kitchensink.git
cd cypress-example-kitchensink
npm ci
npx playwright install chromium
npx allure --version
```

Playwright, TypeScript, `allure-playwright`, and `allure-commandline` are already declared in `package.json`; no separate project initialization is needed.

On a supported Linux host or CI runner, use `npx playwright install --with-deps chromium` to install Chromium and its system dependencies.

## Run the ToDo tests

```shell
npx playwright test tests/todo.spec.ts --project=chromium
```

The Playwright `webServer` configuration starts the application automatically and waits for `http://localhost:8080/todo`. Locally, it reuses an existing server at that address.

To view the browser while testing:

```shell
npx playwright test tests/todo.spec.ts --project=chromium --headed
```

To debug one scenario:

```shell
npx playwright test tests/todo.spec.ts --project=chromium -g "Save changes to a task title" --debug
```

To list the tests without running them:

```shell
npx playwright test tests/todo.spec.ts --project=chromium --list
```

The commands explicitly select `todo.spec.ts` so generated example tests are excluded. Chromium is the currently enabled browser project. The existing `npm test` and `npm run local:run` scripts run Cypress, not this Playwright suite.

For manual exploration only, start the app with `npm start` and open [the ToDo page](http://localhost:8080/todo).

## Test coverage and design

The Gherkin plan contains 10 scenarios. The filter Scenario Outline has three examples, producing 12 Playwright tests:

| Scenario | Test cases |
| --- | ---: |
| Create a task | 1 |
| Reject a title containing only spaces | 1 |
| Save an edited task title | 1 |
| Cancel a title edit with Escape | 1 |
| Delete one task without affecting others | 1 |
| Complete a task and make it active again | 1 |
| Filter by All, Active, and Completed | 3 |
| Clear completed tasks while retaining active tasks | 1 |
| Mark all tasks completed | 1 |
| Preserve tasks and completion states after refresh | 1 |

`pages/ToDoPage.ts` contains locators, reusable user actions, and verification helpers. `tests/todo.spec.ts` expresses the scenarios using those methods. Named `test.step()` blocks make the actions and checks visible in the reports.

Playwright provides an isolated browser context for each test. A fresh application session creates two active tasks: "Pay electric bill" and "Walk the dog". The tests preserve these defaults and include them in their expected lists and counts. The remaining-task counter measures active tasks, not the total number of tasks.

The Gherkin file documents the scenarios; Playwright executes the TypeScript tests. Cucumber is not required by this implementation. Persistence of a nonempty list is an explicit test expectation based on the application's local-storage implementation.

## Allure reporting

The `allure-playwright` reporter writes raw results to `allure-results/`. The `allure-commandline` package supplies the Allure 2 report generator.

After running the tests, generate and open the report:

```shell
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Run these commands even when a test fails, so the failure remains visible in the report. Do not chain report generation to a successful test exit using `&&`.

Before a new run, archive or remove only the previous `allure-results/` directory in this repository if you want a report containing only that run. Allure appends new result files to an existing directory. The generation command's `--clean` option replaces the generated report; it does not clear the raw results.

The report contains test outcomes, named steps, and failure details. Failure screenshots and traces are enabled in the Playwright configuration. The separate Playwright HTML report can be opened with:

```shell
npx playwright show-report
```

Generated artifacts are excluded from Git through `.gitignore`, including `allure-results/`, `allure-report/`, `playwright-report/`, and `test-results/`. The report-generation commands should be used to recreate them after cloning.

## Known defect: duplicate default-task IDs

Bulk completion can leave "Walk the dog" active when the two default tasks receive the same ID. Task IDs are generated from millisecond timestamps, and update logic selects the first matching ID.

In one investigation using five consecutive runs with one worker:

- Four runs had duplicate default-task IDs and failed because "Walk the dog" remained unchecked.
- One run had distinct IDs and passed.

This is evidence from that investigation, not a fixed failure rate. Different execution timing can change whether the defect appears.

Repeat the scenario with:

```shell
npx playwright test tests/todo.spec.ts --project=chromium -g "Mark all tasks as completed" --workers=1 --repeat-each=5
```

The test retains the expected product behavior and can fail while the defect remains. See [this fork's GitHub Issues](https://github.com/hristijanacoski/cypress-example-kitchensink/issues) for defect reports and supporting evidence.

## Docker scope

The inherited Docker examples below run the original Cypress suite. They do not constitute a Docker image containing this Playwright suite and its dependencies. The Playwright Docker bonus is not documented as completed here.

## Further documentation

- [Playwright installation](https://playwright.dev/docs/intro)
- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Allure Playwright integration](https://allurereport.org/docs/playwright/)
- [Allure 2 installation requirements](https://allurereport.org/docs/v2/install-for-nodejs/)

---

The original Kitchen Sink README is preserved below. Its Cypress badges, upstream links, CI descriptions, and Docker instructions describe the original example project; they are not evidence that this fork's Playwright tests or CI pass.

# Kitchen Sink [![renovate-app badge][renovate-badge]][renovate-app] [![semantic-release][semantic-image] ][semantic-url]

This is an example app used to showcase [Cypress.io](https://www.cypress.io/) End-to-End (E2E) testing. The application demonstrates the use of most [Cypress API commands](https://on.cypress.io/api). Additionally this example app is configured to run E2E tests in various CI platforms.
Several workflows demonstrate the CI use of [Cypress Docker images](https://github.com/cypress-io/cypress-docker-images) which provide convenient, pre-configured compatible environments for Cypress.
The [tests](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/cypress/e2e) are also heavily commented.

To see the kitchen sink application, and to view the [Cypress API commands](https://on.cypress.io/api) demonstrated by the app, visit [example.cypress.io](https://example.cypress.io/).

For a full reference of our documentation, go to [docs.cypress.io](https://docs.cypress.io/).

For an example payment application demonstrating real-world usage of Cypress.io End-to-End (E2E) testing, go to the [cypress-io/cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app) repository.

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot
[renovate-app]: https://renovatebot.com/
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

## CI Status

The following table lists live workflows from various CI providers. These each independently test the contents of this example repository. They run and record using [Cypress Cloud](https://on.cypress.io/guides/cloud/introduction) with their results displaying centrally under Cypress Cloud [ProjectId `4b7344`](https://cloud.cypress.io/#/projects/4b7344/runs). Each CI provider shows its build status on its own site:

| CI Provider                                            | Workflow                                       | Build Status                                                            |   Docker example   |
| :----------------------------------------------------- | :--------------------------------------------- | :---------------------------------------------------------------------- | :----------------: |
| [CircleCI][CircleCi docs]                              | [.circleci/config.yml][CircleCI workflow]      | [![CircleCI][CircleCI badge]][CircleCI log]                             | :white_check_mark: |
| [**cypress-io/github-action**][Cy GitHub Actions docs] | [using-action.yml][Cy GitHub Actions workflow] | [![Cypress GHA status][Cy GitHub Actions badge]][Cy GitHub Actions log] |                    |
| [GitHub Actions][GHA docs]                             | [single.yml][GHA workflow single]              | [![Single tests status][GHA badge single]][GHA log single]              |                    |
| [GitHub Actions][GHA docs]                             | [parallel.yml][GHA workflow parallel]          | [![Parallel tests status][GHA badge parallel]][GHA log parallel]        |                    |

<!-- CI provider links -->
[CircleCI docs]:            https://circleci.com/docs/
[CircleCI badge]:           https://circleci.com/gh/cypress-io/cypress-example-kitchensink/tree/master.svg?style=shield
[CircleCI log]:             https://circleci.com/gh/cypress-io/cypress-example-kitchensink/tree/master
[CircleCI workflow]:        .circleci/config.yml

[Cy GitHub Actions docs]:   https://github.com/cypress-io/github-action#readme
[Cy GitHub Actions badge]:  https://github.com/cypress-io/cypress-example-kitchensink/actions/workflows/using-action.yml/badge.svg
[Cy GitHub Actions log]:    https://github.com/cypress-io/cypress-example-kitchensink/actions/workflows/using-action.yml?query=branch%3Amaster
[Cy GitHub Actions workflow]:  .github/workflows/using-action.yml

[GHA docs]:      https://docs.github.com/en/actions
[GHA badge single]:     https://github.com/cypress-io/cypress-example-kitchensink/actions/workflows/single.yml/badge.svg
[GHA badge parallel]:     https://github.com/cypress-io/cypress-example-kitchensink/actions/workflows/parallel.yml/badge.svg
[GHA log single]:       https://github.com/cypress-io/cypress-example-kitchensink/actions/workflows/single.yml?query=branch%3Amaster
[GHA log parallel]:       https://github.com/cypress-io/cypress-example-kitchensink/actions/workflows/parallel.yml?query=branch%3Amaster
[GHA workflow single]:  .github/workflows/single.yml
[GHA workflow parallel]:  .github/workflows/parallel.yml

You can find all CI results recorded on the Cypress Cloud
[![Cypress Cloud](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/4b7344/master&style=flat&logo=cypress)](https://cloud.cypress.io/projects/4b7344/runs)

## CI Workflow Examples

This table shows additional examples of CI workflows. With the exception of GitHub Actions workflows, these are **not** live examples as in the table above and they may require modification before use. The GitHub Actions workflows are live and they run without recording to Cypress Cloud.

| CI Provider                                           | Basic Config                                             | Full Parallel Config                                 |   Docker example   |
| :---------------------------------------------------- | :------------------------------------------------------- | :--------------------------------------------------- | :----------------: |
| [AWS Amplify][AWS Amplify docs]                       | [amplify.yml](amplify.yml)                               |                                                      |                    |
| [AWS CodeBuild][AWS CodeBuild docs]                   | [basic/buildspec.yml](./basic/buildspec.yml)             | [buildspec.yml](buildspec.yml)                       |                    |
| [Azure Pipelines][Azure Pipelines docs]               | [basic/azure-ci.yml](basic/azure-ci.yml)                 | [azure-ci.yml](azure-ci.yml)                         |                    |
| [Buddy.works][Buddy.works docs]                       | [buddy.yml](buddy.yml)                                   |                                                      | :white_check_mark: |
| [Buildkite][Buildkite docs]                           | [.buildkite/pipeline.yml](.buildkite/pipeline.yml)       |                                                      |                    |
| [CircleCI][CircleCi docs]                             | [basic/.circleci/config.yml](basic/.circleci/config.yml) |                                                      | :white_check_mark: |
| [GitHub Actions][GHA docs]                            | [chrome.yml](.github/workflows/chrome.yml)               |                                                      |                    |
| [GitHub Actions][GHA docs]                            | [chrome-docker.yml](.github/workflows/chrome-docker.yml) |                                                      | :white_check_mark: |
| [GitLab][GitLab docs]                                 | [basic/.gitlab-ci.yml](basic/.gitlab-ci.yml)             | [.gitlab-ci.yml](.gitlab-ci.yml)                     | :white_check_mark: |
| [Jenkins][Jenkins docs]                               | [basic/Jenkinsfile](basic/Jenkinsfile)                   | [Jenkinsfile](Jenkinsfile)                           | :white_check_mark: |
| [Semaphore 2.0][Semaphore 2.0 docs]                   | [basic/.semaphore.yml](basic/.semaphore.yml)             | [.semaphore/semaphore.yml](.semaphore/semaphore.yml) |                    |
| [Travis CI][Travis CI docs]                           | [basic/.travis.yml](basic/.travis.yml)                   | [.travis.yml](.travis.yml)                           |                    |

<!-- CI provider doc links -->
[AWS Amplify docs]:             https://docs.amplify.aws/
[AWS CodeBuild docs]:           https://docs.aws.amazon.com/codebuild/
[Azure Pipelines docs]:         https://learn.microsoft.com/en-us/azure/devops/pipelines/
[Buddy.works docs]:             https://buddy.works/docs
[Buildkite docs]:               https://buildkite.com/docs
[GitLab docs]:                  https://docs.gitlab.com/ee/ci/yaml/
[Jenkins docs]:                 https://www.jenkins.io/doc/
[Semaphore 2.0 docs]:           https://docs.semaphoreci.com/
[Travis CI docs]:               https://docs.travis-ci.com/

The Cypress documentation page [CI Provider Examples](https://docs.cypress.io/guides/continuous-integration/ci-provider-examples) provides some more examples with extensive guides for using Cypress with some of the most popular CI providers.

## Run Tests

### Local testing

To run the tests from this repo on your local machine, first make sure your machine meets the [Cypress System Requirements](https://on.cypress.io/guides/getting-started/installing-cypress#System-requirements), including the installation of [Node.js](https://docs.cypress.io/guides/getting-started/installing-cypress#Installing-Nodejs) according to the version specified in the file [.node-version](./.node-version).

Executing the following instructions will clone the repository, install dependencies and run Cypress:

```shell
git clone https://github.com/cypress-io/cypress-example-kitchensink.git
cd cypress-example-kitchensink
npm ci # install dependencies
npm run local:run # run Cypress headlessly
```

`local:run` is a [package.json](./package.json) script that starts a local webserver and then uses [cypress run](https://on.cypress.io/command-line#cypress-run) to run Cypress headlessly.
If you would like to run Cypress tests interactively, then run the following command which uses [cypress open](https://on.cypress.io/command-line#cypress-open) to run Cypress in headed mode. You can pick individual tests to run.

```shell
npm run local:open
```

As an alternative to using the `local:open` and `local:run` scripts, you can also start the server in one step and then run Cypress in a second step.

```shell
npm start # start server on port 8080
```

You can check that the server is running if you open a web browser and navigate to `http://localhost:8080`.

Then in a separate terminal window execute either

```shell
npx cypress run # for headless mode
```

or

```shell
npx cypress open # for headed interactive mode
```

#### Script and server structure

The scripts `local:run` and `local:open` use the `start-test` alias of the npm module [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) to run [./scripts/start.js](./scripts/start.js), which starts the webserver, waits for it to become ready, and then launches Cypress.

The `start` script spawns a webserver using the npm module [serve](https://www.npmjs.com/package/serve) and displays the Kitchen Sink App on port `8080`.

### Docker testing

If you have Docker installed locally, for instance using [Docker Desktop](https://docs.docker.com/desktop/), you can run the tests from this repo interactively in a Docker container.
Use [Cypress Docker images](https://github.com/cypress-io/cypress-docker-images), which are built with all the prerequisites for running Cypress. They are available as [base](https://github.com/cypress-io/cypress-docker-images/tree/master/base), [browsers](https://github.com/cypress-io/cypress-docker-images/tree/master/browsers) and [included](https://github.com/cypress-io/cypress-docker-images/tree/master/included) options from [Docker Hub](https://hub.docker.com/u/cypress) and the [Amazon ECR (Elastic Container Registry) Public Gallery](https://gallery.ecr.aws/cypress-io).

As above, start by cloning the repo and installing dependencies:

```shell
git clone https://github.com/cypress-io/cypress-example-kitchensink
cd cypress-example-kitchensink
npm ci
```

NOTE: For simplicity, the Docker examples below use a repository reference such as `cypress/base` with the `latest` version tag. To select an earlier version, replace `latest` with an explicit tag, for example `cypress/base:20.15.1`. Explicit version tags are recommended for production. Usage is further explained in the [Tags](https://github.com/cypress-io/cypress-docker-images/blob/master/README.md#tags) section of the [Cypress Docker Images - README](https://github.com/cypress-io/cypress-docker-images/blob/master/README.md).

#### cypress/base

The following example uses a [cypress/base](https://github.com/cypress-io/cypress-docker-images/tree/master/base) image which itself contains no browsers. You will use the Electron browser bundled with Cypress instead. To run the Docker container, execute the following:

```shell
docker run -it --rm -v .:/app -w /app cypress/base:latest
```

When the container prompt appears, enter:

```shell
npx cypress install     # install Cypress binary
npm run test:ci         # start server and run tests in Electron browser
exit
```

#### cypress/browsers

With a [cypress/browsers](https://github.com/cypress-io/cypress-docker-images/tree/master/browsers) image you have the additional choice of Chrome, Edge and Firefox browsers. Execute the following:

```shell
docker run -it --rm -v .:/app -w /app cypress/browsers:latest
```

When the container prompt appears, enter:

```shell
npx cypress install     # install Cypress binary
npm run test:ci         # start server and run tests in Electron browser
npm run test:ci:chrome  # start server and run tests in Chrome browser
npm run test:ci:edge    # start server and run tests in Edge browser
npm run test:ci:firefox # start server and run tests in Firefox browser
exit
```

#### cypress/included

The [cypress/included](https://github.com/cypress-io/cypress-docker-images/tree/master/included) images add a full Cypress installation compared to [cypress/browsers](https://github.com/cypress-io/cypress-docker-images/tree/master/browsers).
Execute the following to run the container with a one-line command, testing with the Chrome browser:

```shell
docker run -it --rm -v .:/app -w /app --entrypoint bash cypress/included:latest -c 'npm run test:ci:chrome' # use for matching Cypress versions
```

Replace the `latest` tag in the above command using the Cypress version from the repo's [package.json](./package.json), if this repository has not yet been updated to the latest released Cypress version.
Note that mismatched versions will cause errors.

NOTE: Additional browsers Chrome, Edge and Firefox are installed in `linux/amd64` architecture images `cypress/browsers` and `cypress/included`.
Firefox is available pre-installed for `linux/arm64` architecture images based on Firefox `>=136.0.2`.
Refer to the [Cypress Docker images README](https://github.com/cypress-io/cypress-docker-images/blob/master/README.md#browsers) for details.
The Electron browser, which is built-in to Cypress, is available in all images and architectures.

### CI Testing

If you would like to try out running tests in a Continuous Integration (CI) provider then you need to first [fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) so that you have your own copy. Refer to the [GitHub documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#configuring-git-to-sync-your-fork-with-the-upstream-repository) to set up aliases for `remote upstream` (to this repo) and `remote origin` (to your fork) correctly.
You will also need to have an account with the CI provider you want to test with.

## Documentation

- Use the [Cypress Documentation](https://on.cypress.io) for instructions on how to use Cypress
- Read the [Command Line Guide](https://on.cypress.io/command-line) for run options
- Refer to the [API](https://on.cypress.io/api/) documents to understand the Cypress API calls tested in this repo
- Read [Installing Cypress](https://on.cypress.io/installing-cypress) for step-by-step information on installing Cypress in your own project

## Support

- For "how-to" questions and discussions, go to the Cypress [Discord Chat](https://on.cypress.io/discord) and be part of the worldwide user community!

## Contributing

Check out the [Contributing Guideline](./CONTRIBUTING.md).

## Changelog

See [Releases](https://github.com/cypress-io/cypress-example-kitchensink/releases).
