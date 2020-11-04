const TableController = require('./TableController.js');

//For custom queries of table: employee
const employeeController = new TableController('employee');

employeeController.selectJoinManagerRole = async function(roleTableName) {
  try {
    this.checkConnection();
    const joinQuery = `
    SELECT e.id AS ID,
      CONCAT(e.first_name ,' ', e.last_name) AS Employee,
      ${roleTableName}.title AS Title,
      CONCAT(m.first_name,' ',m.last_name) AS Manager
    FROM ${this.name} e
    LEFT JOIN ${this.name} m ON e.manager_id = m.id
    LEFT JOIN ${roleTableName} ON e.role_id = ${roleTableName}.id
    `
    const [employees] = await this.connection.query(joinQuery);
    return employees;
  } catch(error) {
    console.error(error);
  }
}

employeeController.selectEmployeeRoles = async function(roleTableName) {
  try {
    this.checkConnection();
    const joinQuery = `
    SELECT ${this.name}.id,
      CONCAT(${this.name}.first_name ,' ', ${this.name}.last_name) AS name,
      ${roleTableName}.title
    FROM ${this.name}
    LEFT JOIN ${roleTableName} ON ${this.name}.role_id = ${roleTableName}.id
    `;
    const [employees] = await this.connection.query(joinQuery);
    return employees;
  } catch(error) {
    console.error(error);
  }
}
module.exports = employeeController;