const mysql = require('mysql2/promise');
const FieldFormatter = require('./FieldFormatter.js');

class TableController {
  constructor(name) {
    this.name = mysql.escapeId(name);
  }
}

TableController.prototype.setConnection = function(connection) {
  this.connection = connection;
}

TableController.prototype.checkConnection = function() {
  if (!this.connection) {
    throw new Error(`No connection set for TableController of: ${this.name}`);
  }
}

TableController.prototype.insert = async function(data) {
  try {
    this.checkConnection();
    const insertQuery = `INSERT INTO ${this.name} SET ?`;
    await this.connection.query(insertQuery, data);
  } catch(error) {
    console.error(error);
  }
}

TableController.prototype.selectAll = async function() {
  try {
    this.checkConnection();
    const selectQuery = `SELECT * FROM ${this.name}`;
    const [data] = await this.connection.query(selectQuery);
    //console.table(data);
    return data;
  } catch(error) {
    console.error(error);
  }
}

TableController.prototype.update = async function(set, identifier) {
  try {
    const updateQuery = `
      UPDATE ${this.name}
      SET ?
      WHERE ?`;
    this.checkConnection();
    await this.connection.query(updateQuery, [set, identifier]);
  } catch(error) {
    console.error(error);
  }
}

module.exports = TableController;