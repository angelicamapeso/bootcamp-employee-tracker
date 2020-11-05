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
    process.exit(1);
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
    process.exit(1);
  }
}

employeeController.selectEmployeeManagers = async function() {
  try {
    this.checkConnection();
    const joinQuery = `
    SELECT
      e.id,
      CONCAT(e.first_name, ' ', e.last_name) AS name,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM ${this.name} e
    LEFT JOIN ${this.name} m ON e.manager_id = m.id
    `;
    const [employees] = await this.connection.query(joinQuery);
    return employees;
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

employeeController.selectManagers = async function() {
  try {
    this.checkConnection();
    const joinQuery = `
      SELECT
        m.id,
        CONCAT(m.first_name, ' ', m.last_name) AS name
      FROM ${this.name} m
      INNER JOIN ${this.name} e ON m.id = e.manager_id
      GROUP BY m.id;
    `;
    const [managers] = await this.connection.query(joinQuery);
    return managers;
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

employeeController.selectByManager = async function(roleTableName, managerId) {
  try{
    this.checkConnection();
    const joinQuery = `
      SELECT
        ${this.name}.id AS ID,
        CONCAT(${this.name}.first_name, ' ', ${this.name}.last_name) AS Employee,
        ${roleTableName}.title AS Title
      FROM ${this.name}
      LEFT JOIN ${roleTableName} ON ${this.name}.role_id = ${roleTableName}.id
      WHERE ${this.name}.manager_id = ${managerId};
    `;
    const [employees] = await this.connection.query(joinQuery);
    return employees;
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = employeeController;