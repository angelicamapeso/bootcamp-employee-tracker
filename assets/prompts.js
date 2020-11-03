const inquirer = require('inquirer');

async function mainMenu() {
  const mainMenuChoices = await inquirer.prompt([
    {
      type: 'list',
      name: 'table',
      message: 'Which would you like to modify?',
      choices: [
        'Departments',
        'Roles',
        'Employees',
      ],
    },
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do with Departments?',
      choices: [
        'Add department',
        'View departments',
      ],
      when: currentAnswers => currentAnswers.table === 'Departments',
    },
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do with Roles?',
      choices: [
        'Add role',
        'View roles',
      ],
      when: currentAnswers => currentAnswers.table === 'Roles',
    },
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do with Employees?',
      choices: [
        'Add employee',
        'View employees',
        'Update employee role'
      ],
      when: currentAnswers => currentAnswers.table === 'Employees',
    },
  ]);
  return mainMenuChoices.action;
}

module.exports = {
  mainMenu,
};