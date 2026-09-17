const { spawnSync } = require('node:child_process')

// Run commands with visible output and preserve failures.
function run (command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })

  if (result.error) {
    console.error(result.error.message)
  }

  return result.status ?? 1
}

// Use one worker and no retries so a product defect remains visible.
const testExitCode = run('npx', [
  'playwright', 'test', 'tests/todo.spec.ts',
  '--project=chromium', '--workers=1', '--retries=0',
])

// Generate the report even when a test failed.
const reportExitCode = run('npx', [
  'allure', 'generate', 'allure-results', '--clean', '-o', 'allure-report',
])

// Reporting must not turn a failed test run into a successful container run.
process.exitCode = testExitCode || reportExitCode
