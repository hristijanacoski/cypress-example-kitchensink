import { test, expect } from '@playwright/test';
import { ToDoPage } from '../pages/ToDoPage';

test('Create a new todo item', async ({baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the page and wait for it to load', async () => {
    //Go to Page
    await page.goto(`${baseURL}/todo`);

    //Check if page is loaded
    await page.waitForLoadState('networkidle')
  });

  await test.step('Add Buy groceries', async () => {
    //Add new task
    await todo.addNewTask('Buy groceries');
  });

  await test.step('Verify the new task and remaining count', async () => {
    //Check if task is added and check the count of tasks
    await todo.checkTask('Buy groceries');
    await todo.checkCount(3);
  });
});

test('Reject a task containing only spaces', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app', async () => {
    await page.goto(`${baseURL}/todo`);
  });

  await test.step('Submit a task containing three spaces', async () => {
    // Attempt to create a task with three spaces.
    await todo.addNewTask('   ');
  });

  await test.step('Verify only the two default tasks remain', async () => {
    // Verify the exact list: no blank or extra task was created.
    await expect(todo.taskLabel).toHaveText([
      'Pay electric bill',
      'Walk the dog',
    ]);
  });

  await test.step('Verify both tasks remain active and the count is 2', async () => {
    // Both default tasks should remain active.
    await expect(todo.taskRow).toHaveCount(2);
    await expect(
      todo.taskRow.nth(0).getByRole('checkbox'),
    ).not.toBeChecked();
    await expect(
      todo.taskRow.nth(1).getByRole('checkbox'),
    ).not.toBeChecked();

    await todo.checkCount(2);
  });
});

test('Save changes to a task title', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app and verify its initial state', async () => {
    // Open the app and verify its initial state.
    await page.goto(`${baseURL}/todo`);

    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
    ]);
    await todo.checkCount(2);
  });

  await test.step('Create Go to the gym', async () => {
    // Create the task that this test will edit.
    await todo.addNewTask('Go to the gym');
    await todo.checkTask('Go to the gym');
  });

  await test.step('Rename the task and save with Enter', async () => {
    // Rename the task and save with Enter.
    await todo.editTask('Go to the gym', 'Go to the gym at 6 PM');
  });

  await test.step('Verify the updated title and remaining count', async () => {
    // Verify the new title and confirm the other tasks remain unchanged.
    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Go to the gym at 6 PM',
    ]);
    await todo.checkCount(3);
  });
});

test('Cancel changes to a task title', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app', async () => {
    // Open the app.
    await page.goto(`${baseURL}/todo`);
  });

  await test.step('Create Watch football', async () => {
    // Create the task that this test will edit.
    await todo.addNewTask('Watch football');
    await todo.checkTask('Watch football');
  });

  await test.step('Change the title and cancel with Escape', async () => {
    // Change the title and cancel with Escape.
    await todo.cancelTaskEdit('Watch football', 'Play video games');
  });

  await test.step('Verify the original title remains unchanged', async () => {
    // Verify the original title remains unchanged.
    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Watch football',
    ]);

    await todo.checkTaskNotVisible('Play video games');
    await todo.checkCount(3);
  });
});

test('Delete one task without affecting another', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app', async () => {
    // Open the app.
    await page.goto(`${baseURL}/todo`);
  });

  await test.step('Create two tasks and verify the starting list', async () => {
    // Create two tasks.
    await todo.addNewTask('Buy groceries');
    await todo.addNewTask('Go to the gym');

    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Buy groceries',
      'Go to the gym',
    ]);
  });

  await test.step('Delete Buy groceries', async () => {
    // Delete only Buy groceries.
    await todo.deleteTask('Buy groceries');
  });

  await test.step('Verify the other tasks remain unchanged', async () => {
    // Verify the other tasks remain unchanged.
    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Go to the gym',
    ]);

    await todo.checkTaskNotVisible('Buy groceries');
    await todo.checkCount(3);
  });
});

test('Complete a task and make it active again', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app and create an active task', async () => {
    // Open the app and create an active task.
    await page.goto(`${baseURL}/todo`);
    await todo.addNewTask('Go to the gym');
    await todo.checkTaskActive('Go to the gym');
  });

  await test.step('Complete the task and verify its status', async () => {
    // Complete the task and verify its status.
    await todo.completeTask('Go to the gym');
    await todo.checkTaskCompleted('Go to the gym');
    await todo.checkCount(2);
  });

  await test.step('Verify the default tasks remain active', async () => {
    // Verify the default tasks remain active.
    await todo.checkTaskActive('Pay electric bill');
    await todo.checkTaskActive('Walk the dog');
  });

  await test.step('Make the task active again and verify its status', async () => {
    // Make the task active again and verify its status.
    await todo.activateTask('Go to the gym');
    await todo.checkTaskActive('Go to the gym');
    await todo.checkCount(3);
  });

  await test.step('Verify all three tasks remain in the list', async () => {
    // Verify all three tasks remain in the list.
    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Go to the gym',
    ]);
  });
});

const filterScenarios = [
  {
    filter: 'All',
    visibleTasks: [
      'Pay electric bill',
      'Walk the dog',
      'Buy groceries',
      'Watch football',
    ],
    hiddenTasks: [],
  },
  {
    filter: 'Active',
    visibleTasks: [
      'Pay electric bill',
      'Walk the dog',
      'Buy groceries',
    ],
    hiddenTasks: ['Watch football'],
  },
  {
    filter: 'Completed',
    visibleTasks: ['Watch football'],
    hiddenTasks: [
      'Pay electric bill',
      'Walk the dog',
      'Buy groceries',
    ],
  },
] as const;

// Run a separate test for each filter in the Gherkin examples.
for (const scenario of filterScenarios) {
  test(`Filter tasks by completion status: ${scenario.filter}`, async ({ baseURL, page }) => {
    const todo = new ToDoPage(page);

    await test.step('Open the app and create two tasks', async () => {
      // Open the app and create two tasks.
      await page.goto(`${baseURL}/todo`);
      await todo.addNewTask('Buy groceries');
      await todo.addNewTask('Watch football');
    });

    await test.step('Prepare three active tasks and one completed task', async () => {
      // Prepare three active tasks and one completed task.
      await todo.completeTask('Watch football');

      await todo.checkTaskActive('Pay electric bill');
      await todo.checkTaskActive('Walk the dog');
      await todo.checkTaskActive('Buy groceries');
      await todo.checkTaskCompleted('Watch football');
    });

    await test.step(`Select the ${scenario.filter} filter`, async () => {
      // Select the filter for this example.
      await todo.selectFilter(scenario.filter);
    });

    await test.step('Verify the exact list of matching tasks', async () => {
      // Verify the exact list of matching tasks.
      await todo.checkTaskList([...scenario.visibleTasks]);

      for (const taskName of scenario.visibleTasks) {
        await todo.checkTask(taskName);
      }
    });

    await test.step('Verify nonmatching tasks are hidden', async () => {
      // Verify tasks that do not match the filter are hidden.
      for (const taskName of scenario.hiddenTasks) {
        await todo.checkTaskNotVisible(taskName);
      }
    });

    await test.step('Verify the active-task count remains 3', async () => {
      // Filtering does not change the active-task count.
      await todo.checkCount(3);
    });
  });
}

test('Clear completed tasks while keeping active tasks', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app and create three tasks', async () => {
    // Open the app and create three tasks.
    await page.goto(`${baseURL}/todo`);
    await todo.addNewTask('Buy groceries');
    await todo.addNewTask('Watch football');
    await todo.addNewTask('Play video games');
  });

  await test.step('Complete two tasks and verify their status', async () => {
    // Complete two tasks and verify their status.
    await todo.completeTask('Watch football');
    await todo.completeTask('Play video games');

    await todo.checkTaskCompleted('Watch football');
    await todo.checkTaskCompleted('Play video games');
  });

  await test.step('Remove all completed tasks', async () => {
    // Remove all completed tasks.
    await todo.clearCompletedTasks();
  });

  await test.step('Verify only the three active tasks remain', async () => {
    // Verify only the three active tasks remain.
    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Buy groceries',
    ]);

    await todo.checkTaskActive('Pay electric bill');
    await todo.checkTaskActive('Walk the dog');
    await todo.checkTaskActive('Buy groceries');

    await todo.checkCount(3);
    await todo.checkClearCompletedHidden();
  });
});

// Known bug: duplicate default-task IDs can cause bulk completion to fail.
// Issue: paste your GitHub issue URL here.
test('Mark all tasks as completed', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app and add three tasks to the two defaults', async () => {
    // Open the app and add three tasks to the two defaults.
    await page.goto(`${baseURL}/todo`);
    await todo.addNewTask('Buy groceries');
    await todo.addNewTask('Go to the gym');
    await todo.addNewTask('Watch football');
  });

  const allTasks = [
    'Pay electric bill',
    'Walk the dog',
    'Buy groceries',
    'Go to the gym',
    'Watch football',
  ];

  await test.step('Verify the starting list and active states', async () => {
    // Verify the starting list and active states.
    await todo.checkTaskList(allTasks);

    for (const taskName of allTasks) {
      await todo.checkTaskActive(taskName);
    }
  });

  await test.step('Complete all tasks using the bulk control', async () => {
    // Complete all tasks using the bulk control.
    // Compare the default task IDs in normal and debug runs.
    await todo.markAllCompleted();
  });

  await test.step('Verify all tasks are completed and the count is 0', async () => {
    // Verify every checkbox and title reflects completion.
    for (const taskName of allTasks) {
      await todo.checkTaskCompleted(taskName);
    }

    await todo.checkCount(0);
  });

  await test.step('Verify all five tasks appear in the Completed filter', async () => {
    // Verify all five tasks appear in the Completed filter.
    await todo.selectFilter('Completed');
    await todo.checkTaskList(allTasks);

    for (const taskName of allTasks) {
      await todo.checkTask(taskName);
    }
  });
});

test('Preserve tasks and completion status after refreshing', async ({ baseURL, page }) => {
  const todo = new ToDoPage(page);

  await test.step('Open the app and create two tasks', async () => {
    // Open the app and create two tasks.
    await page.goto(`${baseURL}/todo`);
    await todo.addNewTask('Buy groceries');
    await todo.addNewTask('Play video games');
  });

  await test.step('Complete one task and verify the state before refreshing', async () => {
    // Complete one task and verify the state before refreshing.
    await todo.completeTask('Play video games');

    await todo.checkTaskActive('Pay electric bill');
    await todo.checkTaskActive('Walk the dog');
    await todo.checkTaskActive('Buy groceries');
    await todo.checkTaskCompleted('Play video games');
    await todo.checkCount(3);
  });

  await test.step('Refresh the page', async () => {
    // Refresh the same browser page.
    await page.reload();
  });

  await test.step('Verify all task titles were preserved', async () => {
    // Verify all task titles were preserved.
    await todo.checkTaskList([
      'Pay electric bill',
      'Walk the dog',
      'Buy groceries',
      'Play video games',
    ]);
  });

  await test.step('Verify completion states and the remaining count were preserved', async () => {
    // Verify each task retained its completion status.
    await todo.checkTaskActive('Pay electric bill');
    await todo.checkTaskActive('Walk the dog');
    await todo.checkTaskActive('Buy groceries');
    await todo.checkTaskCompleted('Play video games');

    await todo.checkCount(3);
  });
});