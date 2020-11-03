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

async function addRole() {
  const departments = await getDepartments();
  const roleInfo = await prompts.askRoleInfo(departments);
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

async function addEmployee() {
  const roles = await getRoles();
  const employees = await getEmployees();
  const employeeInfo = await prompts.askEmployeeInfo(roles, employees);
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

async function updateEmployeeRole() {
  const employees = await getEmployeesWithTitles();
  const roles = await getRoles();
  const {id, role_id} = await prompts.askUpdateEmployeeRole(employees, roles);
  await connection.query('UPDATE employee SET ? WHERE ?', [{role_id}, {id}]);
  console.log('Successfully updated employee role!');
}