import { Page, Locator, expect } from '@playwright/test';

export class ToDoPage {
  page: Page;
  newInputField: Locator;
  taskRow: Locator;
  taskCheckBox: Locator;
  deleteButton: Locator;
  taskLabel: Locator;
  toDoCount: Locator;
  clearCompletedButton: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.newInputField = page.locator('[data-test="new-todo"]');
    this.taskRow = page.locator('.todo-list > li');
    this.taskCheckBox = page.getByRole('checkbox');
    this.deleteButton = page.locator('.destroy');
    this.taskLabel = this.taskRow.locator('label');
    this.toDoCount = page.locator('.todo-count strong');
    this.clearCompletedButton = page.locator('.clear-completed');
    
  }


  // Add a new task to the ToDo list
  async addNewTask(task: string) {
    await this.newInputField.click();
    await this.newInputField.fill(task);
    await this.newInputField.press('Enter');
  };

  // Check if a specific task is present in the ToDo list
  async checkTask(task: string) {
    const taskLabelCheck = this.taskLabel.filter({ hasText: task });
    await expect(taskLabelCheck).toBeVisible();
  }

  // Check the count of tasks in the ToDo list
  async checkCount(expectedCount: number) {
    await expect(this.toDoCount).toHaveText(expectedCount.toString());
  };

  // Get a specific task row based on the task name
  getTask(taskName: string): Locator {
  return this.taskRow.filter({
    has: this.page.getByText(taskName, { exact: true }),
  });
}


// Find the task by its exact title.
async editTask(currentTitle: string, newTitle: string) {
  const task = this.taskRow.filter({
    has: this.page.getByText(currentTitle, { exact: true }),
  });

  // Double-click the title to open the edit field.
  await task.locator('label').dblclick();

  // Replace the title and save.
  const editInput = task.locator('.edit');
  await editInput.fill(newTitle);
  await editInput.press('Enter');
}

async checkTaskList(expectedTitles: string[]) {
  // Verify all task titles and their order, with no extra tasks.
  await expect(this.taskLabel).toHaveText(expectedTitles);
};

// Paste these methods inside your class, before its final closing brace.

// Edit a task title and cancel the change with Escape.
async cancelTaskEdit(currentTitle: string, newTitle: string) {
  const task = this.getTask(currentTitle);

  // Double-click the title to open the edit field.
  await task.locator('label').dblclick();

  // Replace the title and cancel.
  const editInput = task.locator('.edit');
  await editInput.fill(newTitle);
  await editInput.press('Escape');
}

// Check that a task is not visible in the list.
async checkTaskNotVisible(taskName: string) {
  await expect(this.getTask(taskName)).toBeHidden();
}

// Delete a specific task.
async deleteTask(taskName: string) {
  const task = this.getTask(taskName);

  // Hover over the task to reveal its delete button.
  await task.hover();
  await task.locator('.destroy').click();
}

// Mark a task as completed.
async completeTask(taskName: string) {
  const task = this.getTask(taskName);
  await task.getByRole('checkbox').check();
}

// Mark a completed task as active again.
async activateTask(taskName: string) {
  const task = this.getTask(taskName);
  await task.getByRole('checkbox').uncheck();
}

// Check that a task is completed and its title is crossed out.
async checkTaskCompleted(taskName: string) {
  const task = this.getTask(taskName);

  await expect(task.getByRole('checkbox')).toBeChecked();
  await expect(task.locator('label')).toHaveCSS('text-decoration-line', /line-through/);
}

// Check that a task is active and its title is not crossed out.
async checkTaskActive(taskName: string) {
  const task = this.getTask(taskName);

  await expect(task.getByRole('checkbox')).not.toBeChecked();
  await expect(task.locator('label')).not.toHaveCSS('text-decoration-line', /line-through/);
}

// Select the All, Active, or Completed filter.
async selectFilter(filter: 'All' | 'Active' | 'Completed') {
  await this.page.getByRole('link', { name: filter, exact: true }).click();
}

// Remove all completed tasks.
async clearCompletedTasks() {
  await this.clearCompletedButton.click();
}

// Check that the Clear completed button is hidden.
async checkClearCompletedHidden() {
  await expect(this.clearCompletedButton).toBeHidden();
}

// Mark all tasks as completed, starting with active tasks.
async markAllCompleted() {
  await this.page.getByText('Mark all as complete').click();
}

};


