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

async function askDepartmentInfo() {
  const departmentInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?',
      validate: name => name ? true : 'Department name cannot be empty!',
      filter: name => name.trim(),
    }
  ]);
  return departmentInfo;
}

async function askRoleInfo(departments) {
  const roleInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the new role?',
      validate: title => title ? true : 'Role title cannot be empty!',
      filter: title => title.trim(),
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the new role?',
      validate: salary => {
        if (salary) {
          if (isNaN(salary)) {
            return 'Salary must be a number.';
          } else if (salary < 0) {
            return 'Salary cannot be negative.';
          } else {
            return true;
          }
        } else {
          return 'Salary cannot be empty!';
        }
      },
      filter: salary => salary.trim(),
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'What department does this role belong to?',
      choices: () => departments.map(department =>
        { return {name: department.name, value: department.id} }
      ),
    }
  ]);
  return roleInfo;
}

module.exports = {
  mainMenu,
  askDepartmentInfo,
  askRoleInfo
};