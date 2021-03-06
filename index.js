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
    process.exit(1);
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
  const [ADD_DEPARTMENT, VIEW_DEPARTMENTS, VIEW_UTILIZED_BUDGET, DELETE_DEPARTMENT] = mainMenuChoices.departmentActions;
  const [ADD_ROLE, VIEW_ROLES, DELETE_ROLE] = mainMenuChoices.roleActions;
  const [ADD_EMPLOYEE,
      VIEW_EMPLOYEES, VIEW_EMPLOYEES_BY_MANAGER,
      DELETE_EMPLOYEE,
      UPDATE_EMPLOYEE_ROLE, UPDATE_EMPLOYEE_MANAGER
    ] = mainMenuChoices.employeeActions;
  const QUIT = mainMenuChoices.quit;

  switch(action) {
    // ---- Department Actions ---- //
    case ADD_DEPARTMENT:
      return await addDepartment();
    case VIEW_DEPARTMENTS:
      return await viewDepartments();
    case VIEW_UTILIZED_BUDGET:
      return await viewUtilizedBudget();
    case DELETE_DEPARTMENT:
      return await deleteDepartment();
    // ---- Role Actions ---- //
    case ADD_ROLE:
      return await addRole();
    case VIEW_ROLES:
      return await viewRoles();
    case DELETE_ROLE:
      return await deleteRole();
    // ---- Employee Actions ---- //
    case ADD_EMPLOYEE:
      return await addEmployee();
    case VIEW_EMPLOYEES:
      return await viewEmployees();
    case VIEW_EMPLOYEES_BY_MANAGER:
      return await viewEmployeesByManager();
    case DELETE_EMPLOYEE:
      return await deleteEmployee();
    case UPDATE_EMPLOYEE_ROLE:
      return await updateEmployeeRole();
    case UPDATE_EMPLOYEE_MANAGER:
      return updateEmployeeManager();
    // ---- Quit ---- //
    case QUIT:
      console.log('Goodbye!');
      return false;
    default:
      throw new Error('Invalid main menu action.');
  }
}

//----- ACTIONS-----//
//----- DEPARTMENT ACTIONS-----//
async function addDepartment() {
  console.log('\n>----- ADD DEPARTMENT ----->');
  const departmentInfo = await prompts.askDepartmentInfo();
  await departmentTable.insert(departmentInfo);
  console.log(`Department '${departmentInfo.name}' added successfully!`);
  return true;
}

async function viewDepartments() {
  console.log('\n>----- VIEW DEPARTMENTS ----->\n');
  const departments = await departmentTable.selectWithAlias();
  console.table('Departments',departments);
  return true;
}

async function viewUtilizedBudget() {
  console.log('\n>----- VIEW UTILIZED BUDGET OF A DEPARTMENT ----->');
  const departments = await departmentTable.selectAll();
  const departmentToView = await prompts.askDepartmentBudgetToView(departments);
  const budget = await employeeTable.getUtilizedBudget(roleTable.name, departmentToView.id);
  console.log(`The total utilized budget for '${departmentToView.name}' is $${budget === null ? '0.00' : budget}.`);
  return true;
}

async function deleteDepartment() {
  console.log('\n>----- DELETE DEPARTMENT ----->');
  const departments = await departmentTable.selectAll();
  const departmentToDelete = await prompts.askDeleteDepartment(departments);
  await departmentTable.delete(departmentToDelete.id);
  console.log(`Department '${departmentToDelete.name}' deleted successfully!`);
  return true;
}

//----- ROLE ACTIONS-----//
async function addRole() {
  console.log('\n>----- ADD ROLE ----->');
  const departments = await departmentTable.selectAll();
  const roleInfo = await prompts.askRoleInfo(departments);
  await roleTable.insert(roleInfo);
  console.log(`Role '${roleInfo.title}' added successfully!`);
  return true;
}

async function viewRoles() {
  console.log('\n>----- VIEW ROLES ----->\n');
  const roles = await roleTable.selectJoinDepartment(departmentTable.name);
  console.table('Roles',roles);
  return true;
}

async function deleteRole() {
  console.log('\n>----- DELETE ROLE ----->');
  const roles = await roleTable.selectAll();
  const roleToDelete = await prompts.askDeleteRole(roles);
  await roleTable.delete(roleToDelete.id);
  console.log(`Role '${roleToDelete.title}' deleted successfully!`);
  return true;
}

//----- EMPLOYEE ACTIONS-----//
async function addEmployee() {
  console.log('\n>----- ADD EMPLOYEE ----->');
  const roles = await roleTable.selectAll();
  const employees = await employeeTable.selectAll();
  const employeeInfo = await prompts.askEmployeeInfo(roles, employees);
  await employeeTable.insert(employeeInfo);
  console.log(`Employee '${employeeInfo.first_name} ${employeeInfo.last_name}' added successfully!`);
  return true;
}

async function viewEmployees() {
  console.log('\n>----- VIEW EMPLOYEES ----->\n');
  const employees = await employeeTable.selectJoinManagerRole(roleTable.name, departmentTable.name);
  console.table('Employees',employees);
  return true;
}

async function viewEmployeesByManager() {
  console.log('\n>----- VIEW EMPLOYEES BY MANAGER ----->');
  const managers = await employeeTable.selectManagers();
  const managerToView = await prompts.askManagerToView(managers);
  const employees = await employeeTable.selectByManager(roleTable.name, managerToView.id);
  console.table(`\n${managerToView.name}'s Employees`, employees);
  return true;
};

async function deleteEmployee() {
  console.log('\n>----- DELETE EMPLOYEE ----->');
  const employees = await employeeTable.selectAll();
  const employeeToDelete = await prompts.askDeleteEmployee(employees);
  await employeeTable.delete(employeeToDelete.id);
  console.log(`Employee '${employeeToDelete.first_name} ${employeeToDelete.last_name}' deleted successfully!`);
  return true;
}

async function updateEmployeeRole() {
  console.log('\n>----- UPDATE EMPLOYEE ROLE ----->');
  const employees = await employeeTable.selectEmployeeRoles(roleTable.name);
  const roles = await roleTable.selectAll();
  const {employeeToUpdate, newRole} = await prompts.askUpdateEmployeeRole(employees, roles);
  await employeeTable.update({role_id: newRole.id}, {id: employeeToUpdate.id});
  console.log(`Employee '${employeeToUpdate.name}' role updated successfully to '${newRole.title}'!`);
  return true;
}

async function updateEmployeeManager() {
  console.log('\n>----- UPDATE EMPLOYEE MANAGER ----->');
  const employees = await employeeTable.selectEmployeeManagers();
  const {employeeToUpdate, newManager} = await prompts.askUpdateEmployeeManager(employees);
  await employeeTable.update({manager_id: newManager.id}, {id: employeeToUpdate.id});
  console.log(`Employee '${employeeToUpdate.name}' manager updated successfully to '${newManager.name}'!`);
  return true;
}