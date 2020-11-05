//All prompts used in program
//Dependencies
const inquirer = require('inquirer');

//Since main menu choices are shared in prompts and index,
//using constants to store choices in one place
const mainMenuChoices = require('./constants/mainMenuChoices.js');

const [DEPARTMENT_TABLE, ROLE_TABLE, EMPLOYEE_TABLE] = mainMenuChoices.tables;
const QUIT = mainMenuChoices.quit;

//Main Menu
async function mainMenu() {
  const mainMenuChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'table',
      message: 'Select a table you would like to perform actions on:',
      choices: [...mainMenuChoices.tables,
        new inquirer.Separator(),
        QUIT,
      ],
    },
    {
      type: 'list',
      name: 'action',
      message: `What would you like to do with ${DEPARTMENT_TABLE}?`,
      choices: [...mainMenuChoices.departmentActions,
        new inquirer.Separator(),
        QUIT,
      ],
      when: currentAnswers => currentAnswers.table === DEPARTMENT_TABLE,
    },
    {
      type: 'list',
      name: 'action',
      message: `What would you like to do with ${ROLE_TABLE}?`,
      choices: [...mainMenuChoices.roleActions,
        new inquirer.Separator(),
        QUIT,
      ],
      when: currentAnswers => currentAnswers.table === ROLE_TABLE,
    },
    {
      type: 'list',
      name: 'action',
      message: `What would you like to do with ${EMPLOYEE_TABLE}?`,
      choices: [...mainMenuChoices.employeeActions,
        new inquirer.Separator(),
        QUIT,
      ],
      when: currentAnswers => currentAnswers.table === EMPLOYEE_TABLE,
    },
  ]);
  return mainMenuChoice.table === QUIT ? mainMenuChoice.table : mainMenuChoice.action;
}

//----- DEPARTMENT PROMPTS -----//
//Use when creating new department
async function askDepartmentInfo() {
  const departmentInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?',
      validate: name =>
        !name ? 'Department name cannot be empty!'
        : name.length > 30 ? 'Department name is too long. (Max length: 30 characters)'
        : true,
      filter: name => name.trim(),
    }
  ]);
  return departmentInfo;
}

//Use when deleting department
async function askDeleteDepartment(departments) {
  const departmentChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which department would you like to delete?',
      choices: () => departments.map(department =>
        { return {name: department.name, value: department.id} }
      ),
    }
  ]);
  return departmentChoice.id;
}

//------ ROLE PROMPTS -----//
//Use when creating new role
async function askRoleInfo(departments) {
  const roleInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the new role?',
      validate: title => !title ? 'Role title cannot be empty!'
        : title.length > 30 ? 'Role title is too long. (Max length: 30 characters)'
        : true,
      filter: title => title.trim(),
    },
    {
      type: 'number',
      name: 'salary',
      message: 'What is the salary of the new role?',
      validate: salary => {
        if (salary) {
          if (salary < 0) {
            return 'Salary cannot be negative.';
          } else if (salary > 99999999.99) {
            return 'Salary is too large. (Max salary: 99999999.99)'
          } else {
            return true;
          }
        } else {
          return 'Salary must be a number!';
        }
      },
      filter: salary => salary ? salary.toFixed(2) : '',
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

async function askDeleteRole(roles) {
  const roleChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which role would you like to delete?',
      choices: () => roles.map(role =>
        { return {name: role.title, value: role.id}}
      ),
    }
  ]);
  return roleChoice.id;
}

//------ EMPLOYEE PROMPTS -----//
//Use when creating new employee
async function askEmployeeInfo(roles, employees) {
  const employeeInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee?',
      validate: (name) =>
        !name ? 'First name cannot be empty!'
        : name.length > 30 ? 'First name is too long. (Max length: 30 characters)'
        : true,
      filter: name => name.trim(),
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee?',
      validate: (name) =>
        !name ? 'Last name cannot be empty!'
        : name.length > 30 ? 'Last name is too long. (Max length: 30 characters)'
        : true,
      filter: name => name.trim(),
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'What role does the employee have?',
      choices: () => roles.map(role =>
        {return {name: role.title, value: role.id}}
      ),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: "Who is the employee's manager?",
      choices: () => employees.map(employee =>
        {return {name: employee.first_name + ' ' + employee.last_name, value: employee.id }}
      ),
    }
  ]);
  return employeeInfo;
}

//Use when updating employee's role
async function askUpdateEmployeeRole(employees, roles) {
  const updateEmployeeRoleInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: "Which employee's role would you like to update?",
      choices: () => employees.map(employee =>
        { return {
          name: `${employee.name}, ${employee.title}`,
          value: employee.id,
          }
        }
      ),
    },
    {
      type: 'list',
      name: 'role_id',
      message: currentAnswers =>
        `What new role would you like to give ${employees.find(employee => employee.id === currentAnswers.id).name}?`,
      choices: () => roles.map(role =>
        {return {name: role.title, value: role.id}}
      ),
    },
  ]);
  return updateEmployeeRoleInfo;
}

module.exports = {
  mainMenu,
  askDepartmentInfo,
  askRoleInfo,
  askEmployeeInfo,
  askUpdateEmployeeRole,
  askDeleteDepartment,
  askDeleteRole,
};