const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connectionDetails = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_db',
};

let connection;
main();

async function main() {
  try {
    connection = await mysql.createConnection(connectionDetails);
    console.log(`Connected with id: ${connection.threadId}`);
  } catch(err) {
    console.error(err);
  } finally {
    if (connection) connection.end();
  }
}