const TableController = require('./TableController.js');
const mysql = require('mysql2/promise');

const employeeController = new TableController('employee');

employeeController.selectWithAlias = async function(roleTableName) {
  try {
    this.checkConnection();
    const aliasQuery = `
    SELECT e.id AS ID,
      CONCAT(e.first_name ,' ', e.last_name) AS Employee,
      ${roleTableName}.title,
      CONCAT(m.first_name,' ',m.last_name) AS Manager
    FROM ${this.name} e
    LEFT JOIN ${this.name} m ON e.manager_id = m.id
    LEFT JOIN ${roleTableName} ON e.role_id = role.id
    `
    const [employees] = await this.connection.query(aliasQuery);
    return employees;
  } catch(error) {
    console.error(error);
  }
}

module.exports = employeeController;