const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connectionDetails = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_db',
};