Feature: Manage ToDo tasks
  As a user
  I want to create, update, organise, and delete tasks
  So that I can keep track of my daily activities

  Background:
    Given I have opened the ToDo application
    And the task list is empty
    And the "All" filter is selected

  Rule: Create tasks

    Scenario: Add a new task
      When I add a task named "Buy groceries"
      Then the task list should contain exactly "Buy groceries"
      And the task should be active
      And the remaining task count should be 1

    Scenario: Reject a task containing only spaces
      When I enter "   " as a new task title
      And I submit the new task
      Then the task list should remain empty

  Rule: Edit tasks

    Scenario: Save changes to a task title
      Given I have added a task named "Go to the gym"
      When I edit the task named "Go to the gym"
      And I replace its title with "Go to the gym at 6 PM"
      And I press Enter to save
      Then the task list should contain exactly "Go to the gym at 6 PM"
      And the remaining task count should be 1

    Scenario: Cancel changes to a task title
      Given I have added a task named "Watch football"
      When I edit the task named "Watch football"
      And I replace its title with "Play video games"
      And I press Escape to cancel
      Then the task list should contain exactly "Watch football"
      And the task named "Play video games" should not be visible

  Rule: Delete tasks

    Scenario: Delete one task without affecting another
      Given I have added the following tasks:
        | title            |
        | Buy groceries    |
        | Go to the gym    |
      When I delete the task named "Buy groceries"
      Then the task list should contain exactly "Go to the gym"
      And the remaining task count should be 1

  Rule: Complete tasks

    Scenario: Complete a task and make it active again
      Given I have added a task named "Go to the gym"
      When I mark the task named "Go to the gym" as completed
      Then its checkbox should be checked
      And its title should appear crossed out
      And the remaining task count should be 0

      When I mark the task named "Go to the gym" as active
      Then its checkbox should be unchecked
      And its title should not appear crossed out
      And the remaining task count should be 1

  Rule: Filter tasks

    Scenario Outline: Filter tasks by completion status
      Given I have added an active task named "Buy groceries"
      And I have added a completed task named "Watch football"
      When I select the "<filter>" filter
      Then I should see exactly <visible_count> tasks
      And "Buy groceries" should be <active_visibility>
      And "Watch football" should be <completed_visibility>
      And the remaining task count should be 1

      Examples:
        | filter    | visible_count | active_visibility | completed_visibility |
        | All       | 2             | visible           | visible               |
        | Active    | 1             | visible           | hidden                |
        | Completed | 1             | hidden            | visible               |

  Rule: Clear completed tasks

    Scenario: Clear completed tasks while keeping active tasks
      Given I have added an active task named "Buy groceries"
      And I have added a completed task named "Watch football"
      And I have added a completed task named "Play video games"
      When I clear completed tasks
      Then the task list should contain exactly "Buy groceries"
      And the remaining task count should be 1
      And the clear completed control should be hidden

  Rule: Bulk update tasks

    Scenario: Mark all tasks as completed
      Given I have added the following tasks:
        | title            |
        | Buy groceries    |
        | Go to the gym    |
        | Watch football   |
      When I mark all tasks as completed
      Then every task checkbox should be checked
      And every task title should appear crossed out
      And the remaining task count should be 0

      When I select the "Completed" filter
      Then I should see exactly 3 tasks

  Rule: Persist tasks

    Scenario: Preserve tasks and completion status after refreshing
      Given I have added an active task named "Buy groceries"
      And I have added a completed task named "Play video games"
      When I refresh the page
      Then the task list should contain exactly these tasks:
        | title             | status    |
        | Buy groceries     | active    |
        | Play video games  | completed |
      And the remaining task count should be 1