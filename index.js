const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

const connectionDetails = require('./assets/connectionDetails.js');
const prompts = require('./assets/prompts.js');
const TableController = require('./assets/TableController.js');
const Field = require('./assets/Field.js');

let connection;
const departmentTable = new TableController('department');
const roleTable = new TableController('role');
const employeeTable = new TableController('employee');
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
  const departments = await departmentTable.selectFields([
    new Field('id').setAlias('ID'),
    new Field('name').setAlias('Department Name'),
  ]);
  console.table(departments);
}

async function addRole() {
  const departments = await departmentTable.selectAll();
  const roleInfo = await prompts.askRoleInfo(departments);
  roleTable.insert(roleInfo);
  console.log('Role successfully added!');
}

async function viewRoles() {
  const roles = await roleTable.leftJoin({
    selectFields: [
      new Field('id', roleTable.name).setAlias('ID'),
      new Field('title', roleTable.name).setAlias('Title'),
      new Field('salary', roleTable.name).setAlias('Salary'),
      new Field('name', departmentTable.name).setAlias('Department'),
    ],
    joins: [
      {
        left: new Field('department_id', roleTable.name),
        right: new Field('id', departmentTable.name),
      }
    ]
  });
  console.table(roles);
}

async function viewEmployees() {
  // const employees = await getEmployees();
  const employeeAlias = 'e';
  const managerAlias = 'm';
  const employees = await employeeTable.leftJoin({
    selectFields: [
      new Field('id', employeeTable.name, employeeAlias).setAlias('ID'),
      new Field('employeeName').setCustom(`
        CONCAT(${mysql.escapeId(employeeAlias)}.${mysql.escapeId('first_name')}, ' ',
        ${mysql.escapeId(employeeAlias)}.${mysql.escapeId('last_name')})`)
          .setAlias('Employee'),
      new Field('title', roleTable.name).setAlias('Role'),
      new Field('managerName').setCustom(`CONCAT(${mysql.escapeId(managerAlias)}.${mysql.escapeId('first_name')}, ' ',
        ${mysql.escapeId(managerAlias)}.${mysql.escapeId('last_name')})`)
          .setAlias('Manager'),
    ],
    joins: [
      {
        left: new Field('manager_id', employeeTable.name, employeeAlias),
        right: new Field('id', employeeTable.name, managerAlias),
      },
      {
        left: new Field('role_id', employeeTable.name, employeeAlias),
        right: new Field('id', roleTable.name),
      }
    ],
    leftAlias: mysql.escapeId(employeeAlias),
  });
  console.table(employees);
}

async function addEmployee() {
  const roles = await roleTable.selectAll();
  const employees = await employeeTable.selectAll();
  const employeeInfo = await prompts.askEmployeeInfo(roles, employees);
  await connection.query('INSERT INTO employee SET ?', employeeInfo);
  console.log('Employee successfully added!');
}

async function updateEmployeeRole() {
  const employees = await employeeTable.leftJoin({
    selectFields: [
      new Field('id', employeeTable.name),
      new Field('first_name', employeeTable.name),
      new Field('last_name', employeeTable.name),
      new Field('title', roleTable.name)
    ],
    joins: [
      {
        left: new Field('role_id', employeeTable.name),
        right: new Field('id', roleTable.name),
      }
    ]
  });
  const roles = await roleTable.selectAll();
  const {id, role_id} = await prompts.askUpdateEmployeeRole(employees, roles);
  await connection.query('UPDATE employee SET ? WHERE ?', [{role_id}, {id}]);
  console.log('Successfully updated employee role!');
}