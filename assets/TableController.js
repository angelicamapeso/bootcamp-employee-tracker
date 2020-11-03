const mysql = require('mysql2/promise');
const Field = require('./Field.js');

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

TableController.prototype.selectFields = async function (fields) {
  try {
    this.checkConnection();
    const formattedFields = fields.map(field => field.formatFieldForQuery());
    const selectQuery = `SELECT ${formattedFields.join(', ')} FROM ${this.name}`;
    const [data] = await this.connection.query(selectQuery);
    return data;
  } catch(error) {
    console.error(error);
  }
}

TableController.formatField = function (field, tableName) {
  return (tableName ? tableName + '.' : '')
    + mysql.escapeId(field.name)
    + (field.as ? ' AS ' + mysql.escape(field.as) : '');
}

TableController.prototype.getLeftJoinQuery = function({selectFields, joins}) {
  const formattedSelectFields = selectFields.map(field => field.formatFieldForQuery());
  let leftJoinQuery = `
    SELECT ${formattedSelectFields.join(',')}
    FROM ${this.name}`;
  joins.forEach(function(join){
    leftJoinQuery += `
      LEFT JOIN ${join.right.tableName} ${join.right.tableAlias ? join.right.tableAlias : ''}
      ON ${join.left.formatFieldForQuery()} = ${join.right.formatFieldForQuery()}`;
  });
  return leftJoinQuery;
}

TableController.prototype.leftJoin = async function(joinInfo) {
  try {
    const leftJoinQuery = this.getLeftJoinQuery(joinInfo);
    this.checkConnection();
    const [data] = await this.connection.query(leftJoinQuery);
    return data;
  } catch(error) {
    console.error(error);
  }
}

module.exports = TableController;