//Dependencies
const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

//Holds connection details for connection to database
const connectionDetails = require('./assets/constants/connectionDetails.js');
//All program prompts
const prompts = require('./assets/prompts.js');
//Used for retrieving choices used in main menu
const mainMenuChoices = require('./assets/constants/mainMenuChoices.js');

//Database connection variable
let connection;

//Access to table controller objects
//Split into seperate files for custom queries
const departmentTable = require('./assets/tableControllers/departmentController.js')
const roleTable = require('./assets/tableControllers/roleController.js');
const employeeTable = require('./assets/tableControllers/employeeController.js');

//Starts application
init();

async function init() {
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

//----- CONNECTING TO DATABASE AND INITIALIZING CONNECTION FOR TABLES -----//
async function connect() {
  connection = await mysql.createConnection(connectionDetails);
  departmentTable.setConnection(connection);
  roleTable.setConnection(connection);
  employeeTable.setConnection(connection);
  console.log(`Connected with id: ${connection.threadId}`);
}

//----- EXECUTOR -----//
async function runApp() {
  const action = await prompts.mainMenu();

  //Deconstructing main menu choices
  const [ADD_DEPARTMENT, VIEW_DEPARTMENTS] = mainMenuChoices.departmentActions;
  const [ADD_ROLE, VIEW_ROLES] = mainMenuChoices.roleActions;
  const [ADD_EMPLOYEE, VIEW_EMPLOYEES, UPDATE_EMPLOYEE_ROLE] = mainMenuChoices.employeeActions;

  switch(action) {
    case ADD_DEPARTMENT:
      console.log('Adding department ...');
      //TODO: ensure function returns true/false
      await addDepartment();
      break;
    case VIEW_DEPARTMENTS:
      console.log('Viewing departments ...');
      //TODO: ensure function returns true/false
      await viewDepartments();
      break;
    case ADD_ROLE:
      console.log('Adding roles ...');
      //TODO: ensure function returns true/false
      await addRole();
      break;
    case VIEW_ROLES:
      console.log('Viewing roles ...');
      //TODO: ensure function returns true/false
      await viewRoles();
      break;
    case ADD_EMPLOYEE:
      console.log('Adding employees ...');
      //TODO: ensure function returns true/false
      await addEmployee();
      break;
    case VIEW_EMPLOYEES:
      console.log('Viewing employees ...');
      //TODO: ensure function returns true/false
      await viewEmployees();
      break;
    case UPDATE_EMPLOYEE_ROLE:
      console.log('Updating employee role ...');
      //TODO: ensure function returns true/false
      await updateEmployeeRole();
      break;
    default:
      throw new Error('Invalid main menu action.');
  }
}

//----- ACTIONS-----//
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
  const roles = await roleTable.selectJoinDepartment(departmentTable.name);
  console.table(roles);
}

async function viewEmployees() {
  const employees = await employeeTable.selectJoinManagerRole(roleTable.name);
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
  const employees = await employeeTable.selectEmployeeRoles(roleTable.name);
  const roles = await roleTable.selectAll();
  const {id, role_id} = await prompts.askUpdateEmployeeRole(employees, roles);
  employeeTable.update({role_id}, {id});
  console.log('Successfully updated employee role!');
}