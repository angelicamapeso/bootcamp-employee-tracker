const TableController = require('./TableController.js');
const mysql = require('mysql2/promise');

const roleController = new TableController('role');

roleController.selectWithAlias = async function(departmentName) {
  try {
    this.checkConnection();
    const aliasQuery = `
    SELECT ${this.name}.id AS ID, ${this.name}.title AS Title, 
      ${this.name}.salary AS Salary, ${departmentName}.name AS Department
    FROM ${this.name}
    LEFT JOIN ${departmentName} ON ${this.name}.department_id = ${departmentName}.id`;
    const [roles] = await this.connection.query(aliasQuery);
    return roles;
  } catch(error) {
    console.error(error);
  }
}

module.exports = roleController;