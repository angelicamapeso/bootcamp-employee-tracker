const TableController = require('./TableController.js');

const roleController = new TableController('role');

roleController.selectWithAlias = async function(departmentTableName) {
  try {
    this.checkConnection();
    const aliasQuery = `
    SELECT ${this.name}.id AS ID, ${this.name}.title AS Title,
      ${this.name}.salary AS Salary, ${departmentTableName}.name AS Department
    FROM ${this.name}
    LEFT JOIN ${departmentTableName} ON ${this.name}.department_id = ${departmentTableName}.id`;
    const [roles] = await this.connection.query(aliasQuery);
    return roles;
  } catch(error) {
    console.error(error);
  }
}

module.exports = roleController;