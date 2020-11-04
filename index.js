const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

const connectionDetails = require('./assets/constants/connectionDetails.js');
const prompts = require('./assets/prompts.js');
const TableController = require('./assets/tableControllers/TableController.js');

let connection;
const departmentTable = require('./assets/tableControllers/departmentController.js')
const roleTable = require('./assets/tableControllers/roleController.js');
const employeeTable = require('./assets/tableControllers/employeeController.js');
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
  departmentTable.setConnection(connection);
  roleTable.setConnection(connection);
  employeeTable.setConnection(connection);
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
  await departmentTable.insert(departmentInfo);
  console.log('Department added successfully!');
}

async function viewDepartments() {
  const departments = await departmentTable.selectWithAlias();
  console.table(departments);
}

async function addRole() {
  const departments = await departmentTable.selectAll();
  const roleInfo = await prompts.askRoleInfo(departments);
  roleTable.insert(roleInfo);
  console.log('Role successfully added!');
}

async function viewRoles() {
  const roles = await roleTable.selectWithAlias(departmentTable.name);
  console.table(roles);
}

async function viewEmployees() {
  const employees = await employeeTable.selectWithAlias(roleTable.name);
  console.table(employees);
}

async function addEmployee() {
  const roles = await roleTable.selectAll();
  const employees = await employeeTable.selectAll();
  const employeeInfo = await prompts.askEmployeeInfo(roles, employees);
  await employeeTable.insert(employeeInfo);
  console.log('Employee successfully added!');
}

async function updateEmployeeRole() {
  const [employees] = await connection.query(`
  SELECT employee.id, employee.first_name, employee.last_name, role.title
  FROM ${employeeTable.name} LEFT JOIN ${roleTable.name} ON employee.role_id = role.id`);
  const roles = await roleTable.selectAll();
  const {id, role_id} = await prompts.askUpdateEmployeeRole(employees, roles);
  employeeTable.update({role_id}, {id});
  console.log('Successfully updated employee role!');
}