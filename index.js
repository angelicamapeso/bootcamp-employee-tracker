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
    await connect();
    console.log('\nWelcome to the Employee Database Manager!');
    let canContinue = true;
    while (canContinue) {
      canContinue = await runApp();
    }
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
  console.log(`[Connected to ${connectionDetails.database} with id: ${connection.threadId}]`);
}

//----- EXECUTOR -----//
async function runApp() {
  console.log('\n>>----- MAIN MENU ----->>');
  const action = await prompts.mainMenu();

  //Deconstructing main menu choices
  const [ADD_DEPARTMENT, VIEW_DEPARTMENTS] = mainMenuChoices.departmentActions;
  const [ADD_ROLE, VIEW_ROLES] = mainMenuChoices.roleActions;
  const [ADD_EMPLOYEE, VIEW_EMPLOYEES, UPDATE_EMPLOYEE_ROLE] = mainMenuChoices.employeeActions;
  const QUIT = mainMenuChoices.quit;

  switch(action) {
    // ---- Department Actions ---- //
    case ADD_DEPARTMENT:
      await addDepartment();
      return true;
    case VIEW_DEPARTMENTS:
      await viewDepartments();
      return true;
    // ---- Role Actions ---- //
    case ADD_ROLE:
      await addRole();
      return true;
    case VIEW_ROLES:
      await viewRoles();
      return true;
    // ---- Employee Actions ---- //
    case ADD_EMPLOYEE:
      await addEmployee();
      return true;
    case VIEW_EMPLOYEES:
      await viewEmployees();
      return true;
    case UPDATE_EMPLOYEE_ROLE:
      await updateEmployeeRole();
      return true;
    // ---- Quit ---- //
    case QUIT:
      console.log('Goodbye!');
      return false;
    default:
      throw new Error('Invalid main menu action.');
  }
}

//----- ACTIONS-----//
async function addDepartment() {
  console.log('\n>----- ADD DEPARTMENT ----->');
  const departmentInfo = await prompts.askDepartmentInfo();
  await departmentTable.insert(departmentInfo);
  console.log('Department added successfully!');
}

async function viewDepartments() {
  console.log('\n>----- VIEW DEPARTMENTS ----->\n');
  const departments = await departmentTable.selectWithAlias();
  console.table('DEPARTMENTS',departments);
}

async function addRole() {
  console.log('\n>----- ADD ROLE ----->');
  const departments = await departmentTable.selectAll();
  const roleInfo = await prompts.askRoleInfo(departments);
  roleTable.insert(roleInfo);
  console.log('Role successfully added!');
}

async function viewRoles() {
  console.log('\n>----- VIEW ROLES ----->\n');
  const roles = await roleTable.selectJoinDepartment(departmentTable.name);
  console.table('ROLES',roles);
}

async function viewEmployees() {
  console.log('\n>----- VIEW EMPLOYEES ----->\n');
  const employees = await employeeTable.selectJoinManagerRole(roleTable.name);
  console.table('EMPLOYEES',employees);
}

async function addEmployee() {
  console.log('\n>----- ADD EMPLOYEE ----->');
  const roles = await roleTable.selectAll();
  const employees = await employeeTable.selectAll();
  const employeeInfo = await prompts.askEmployeeInfo(roles, employees);
  await employeeTable.insert(employeeInfo);
  console.log('Employee successfully added!');
}

async function updateEmployeeRole() {
  console.log('\n>----- UPDATE EMPLOYEE ROLE ----->');
  const employees = await employeeTable.selectEmployeeRoles(roleTable.name);
  const roles = await roleTable.selectAll();
  const {id, role_id} = await prompts.askUpdateEmployeeRole(employees, roles);
  employeeTable.update({role_id}, {id});
  console.log('Successfully updated employee role!');
}