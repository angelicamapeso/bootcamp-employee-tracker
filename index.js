const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connectionDetails = require('./assets/connectionDetails.js');
const prompts = require('./assets/prompts.js');

let connection;
main();

//TODO: move database functions to separate file

async function main() {
  try {
    //TODO: add loop to keep asking for menu prompts
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
  const action = await prompts.mainMenu();
  switch(action) {
    case 'Add department':
      console.log('Adding department ...');
      //TODO: ensure function returns true/false
      await addDepartment();
      break;
    case 'View departments':
      console.log('Viewing departments ...');
      //TODO: ensure function returns true/false
      await viewDepartments();
      break;
    case 'Add role':
      console.log('Adding roles ...');
      //TODO: ensure function returns true/false
      await addRole();
      break;
    case 'View roles':
      console.log('Viewing roles ...');
      //TODO: ensure function returns true/false
      await viewRoles();
      break;
    case 'Add employee':
      console.log('Adding employees ...');
      //TODO: ensure function returns true/false
      await addEmployee();
      break;
    case 'View employees':
      console.log('Viewing employees ...');
      //TODO: ensure function returns true/false
      await viewEmployees();
      break;
    case 'Update employee role':
      console.log('Updating employee role ...');
      //TODO: ensure function returns true/false
      await updateEmployeeRole();
      break;
    default:
      throw new Error('Invalid main menu action.');
  }
}

async function addDepartment() {
  const departmentInfo = await prompts.askDepartmentInfo();
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

async function addEmployee() {
  const employeeInfo = await askEmployeeInfo();
  await connection.query('INSERT INTO employee SET ?', employeeInfo);
  console.log('Employee successfully added!');
}

async function getEmployeesWithTitles() {
  const query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id;
  `
  const [employees] = await connection.query(query);
  console.log(employees);
  return employees;
}

async function askUpdateEmployeeRole() {
  const employees = await getEmployeesWithTitles();
  const roles = await getRoles();
  const updateEmployeeRoleInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: "Which employee's role would you like to update?",
      choices: () => employees.map(employee =>
        { return {
          name: `${employee.first_name} ${employee.last_name} | ${employee.title}`,
          value: employee.id,
          }
        }
      ),
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'What role would you like to give the employee?',
      choices: () => roles.map(role =>
        {return {name: role.title, value: role.id}}
      ),
    },
  ]);
  return updateEmployeeRoleInfo;
}

async function updateEmployeeRole() {
  const {id, role_id} = await askUpdateEmployeeRole();
  await connection.query('UPDATE employee SET ? WHERE ?', [{role_id}, {id}]);
  console.log('Successfully updated employee role!');
}