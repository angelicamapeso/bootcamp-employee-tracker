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
      break;
    case 'View roles':
      console.log('Viewing roles ...');
      break;
    case 'Add employee':
      console.log('Adding employees ...');
      break;
    case 'View employees':
      console.log('Viewing employees ...');
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
      when: (currentAnswers) => { return currentAnswers.table === 'Departments'},
    },
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do with Roles?',
      choices: [
        'Add role',
        'View roles',
      ],
      when: (currentAnswers) => { return currentAnswers.table === 'Roles'},
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
      when: (currentAnswers) => { return currentAnswers.table === 'Employees'},
    },
  ]);
  return mainMenuChoices.action;
}

async function askDepartmentInfo() {
  const departmentInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'depName',
      message: 'What is the name of the new department?',
      validate: (name) => { return name.trim() ? true : 'Department name cannot be empty!'; },
      filter: (name) => { return name.trim(); },
    }
  ]);
  return departmentInfo;
}

async function addDepartment() {
  const {depName} = await askDepartmentInfo();
  await connection.query('INSERT INTO department SET ?', {
    name: depName,
  });
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