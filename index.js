const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connectionDetails = require('./assets/connectionDetails.js');

let connection;
main();

async function main() {
  try {
    await connect();
    await runApp();
  } catch(err) {
    console.error(err);
  } finally {
    if (connection) connection.end();
  }
}

async function connect() {
  connection = await mysql.createConnection(connectionDetails);
  console.log(`Connected with id: ${connection.threadId}`);
}

async function runApp() {
  const action = await getMainMenuChoice();
  switch(action) {
    case 'Add department':
      console.log('Adding department ...');
      await addDepartment();
      break;
    case 'View departments':
      console.log('Viewing departments ...');
      await viewDepartments();
      break;
    case 'Add role':
      console.log('Adding roles ...');
      await addRole();
      break;
    case 'View roles':
      console.log('Viewing roles ...');
      await viewRoles();
      break;
    case 'Add employee':
      console.log('Adding employees ...');
      break;
    case 'View employees':
      console.log('Viewing employees ...');
      await viewEmployees();
      break;
    case 'Update employee role':
      console.log('Updating employee role ...');
      break;
    default:
      throw new Error('Invalid main menu action.');
  }
}

async function getMainMenuChoice() {
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

async function addDepartment() {
  const departmentInfo = await askDepartmentInfo();
  await connection.query('INSERT INTO department SET ?', departmentInfo);
  console.log('Department added successfully!');
}

async function viewDepartments() {
  const departments = await getDepartments();
  console.table(departments);
}

async function getDepartments() {
  const [departments] = await connection.query('SELECT * FROM department');
  return departments;
}

async function askRoleInfo() {
  const departments = await getDepartments();
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

async function addRole() {
  const roleInfo = await askRoleInfo();
  await connection.query('INSERT INTO role SET ?', roleInfo);
  console.log('Role successfully added!');
}

async function getRoles() {
  const [roles] = await connection.query('SELECT * FROM role');
  return roles;
}

async function viewRoles() {
  const roles = await getRoles();
  console.table(roles);
}

async function getEmployees() {
  const [employees] = await connection.query('SELECT * FROM employee');
  return employees;
}

async function viewEmployees() {
  const employees = await getEmployees();
  console.table(employees);
}

async function askEmployeeInfo() {
  const roles = await getRoles();
  const employees = await getEmployees();
  const employeeInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee?',
      validate: (name) => name ? true : 'First name cannot be empty!',
      filter: name => name.trim(),
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee?',
      validate: (name) => name ? true : 'Last name cannot be empty!',
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