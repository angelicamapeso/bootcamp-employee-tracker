//All prompts used in program
//Dependencies
const inquirer = require('inquirer');

//Since main menu choices are shared in prompts and index,
//using constants to store choices in one place
const mainMenuChoices = require('./constants/mainMenuChoices.js');

const [DEPARTMENT_TABLE, ROLE_TABLE, EMPLOYEE_TABLE] = mainMenuChoices.tables;
const QUIT = mainMenuChoices.quit;

//Wrapping all prompt functions in object
const prompts = {};

//Main Menu
prompts.mainMenu = async () => {
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
prompts.askDepartmentInfo = async () => {
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

prompts.askDepartmentBudgetToView = async (departments) => {
  const departmentChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'toView',
      message: "Which department's utilized budget would you like to view?",
      choices: () => departments.map(department =>
        ({name: department.name, value: department})
      ),
    }
  ]);
  return departmentChoice.toView;
}

//Use when deleting department
prompts.askDeleteDepartment = async (departments) => {
  const departmentChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'toDelete',
      message: 'Which department would you like to delete?',
      choices: () => departments.map(department =>
        ({name: department.name, value: department})
      ),
    }
  ]);
  return departmentChoice.toDelete;
}

//------ ROLE PROMPTS -----//
//Use when creating new role
prompts.askRoleInfo = async (departments) => {
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
        ({name: department.name, value: department.id})
      ),
    }
  ]);
  return roleInfo;
}

prompts.askDeleteRole = async (roles) => {
  const roleChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'toDelete',
      message: 'Which role would you like to delete?',
      choices: () => roles.map(role =>
        ({name: role.title, value: role})
      ),
    }
  ]);
  return roleChoice.toDelete;
}

//------ EMPLOYEE PROMPTS -----//
//Use when creating new employee
prompts.askEmployeeInfo = async (roles, employees) => {
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
        ({name: role.title, value: role.id})
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

prompts.askManagerToView = async (managers) => {
  const managerChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: "Which manager's employees would you like to view?",
      choices: () => managers.map(manager =>
        ({name: manager.name, value: manager})
      ),
    }
  ]);
  return managerChoice.manager;
}

prompts.askDeleteEmployee = async (employees) => {
  const employeeChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'toDelete',
      message: 'Which employee would you like to delete?',
      choices: () => employees.map(employee =>
        ({name: employee.first_name + ' ' + employee.last_name, value: employee})
      ),
    }
  ]);
  return employeeChoice.toDelete;
}

//Use when updating employee's role
prompts.askUpdateEmployeeRole = async (employees, roles) => {
  const updateEmployeeRoleInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeToUpdate',
      message: "Which employee's role would you like to update?",
      choices: () => employees.map(employee =>
        ({
          name: `${employee.name}, ${employee.title}`,
          value: employee,
        })
      ),
    },
    {
      type: 'list',
      name: 'newRole',
      message: currentAnswers =>
        `What new role would you like to give ${currentAnswers.employeeToUpdate.name}?`,
      choices: () => roles.map(role =>
        ({name: role.title, value: role})
      ),
    },
  ]);
  return updateEmployeeRoleInfo;
}

prompts.askUpdateEmployeeManager = async (employees) => {
  const updateEmployeeManagerInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeToUpdate',
      message: "Which employee's manager would you like to update?",
      choices: () => employees.map(employee =>
        ({
          name: `${employee.name}, Manager: ${employee.manager}`,
          value: employee,
        })
      ),
    },
    {
      type: 'list',
      name: 'newManager',
      message: currentAnswers =>
        `Which employee should be assigned as ${currentAnswers.employeeToUpdate.name}'s new manager?`,
      choices: currentAnswers =>
        //employees cannot set themselves as their own manager
        employees.filter(employee => employee.id !== currentAnswers.employeeToUpdate.id)
        .map(employee =>
          ({
            name: employee.name,
            value: employee,
          })
        ),
    },
  ]);
  return updateEmployeeManagerInfo;
}

module.exports = prompts;