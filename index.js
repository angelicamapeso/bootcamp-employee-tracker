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
  const mainMenuChoice = await getMainMenuChoice();
  console.log(mainMenuChoice);
  //switch case options
  //return action
}

async function getMainMenuChoice() {
  const mainMenuChoice = await inquirer.prompt([
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
  return mainMenuChoice;
}