const mysql = require('mysql2/promise');

class Field {
  constructor(fieldName, tableName, tableAlias) {
    this.fieldName = mysql.escapeId(fieldName);
    if (tableName) this.tableName = tableName;
    if (tableAlias) this.tableAlias = mysql.escapeId(tableAlias);
  }
}

Field.prototype.setCustom = function(custom) {
  this.custom = custom;
  return this;
}

Field.prototype.setAlias = function(fieldAlias) {
  this.fieldAlias = mysql.escape(fieldAlias);
  return this;
}

Field.prototype.formatFieldForQuery = function () {
  return (this.custom ? this.custom
      :  this.tableAlias ? this.tableAlias + '.'
      : this.tableName ? this.tableName + '.'
      : '')
    + (this.custom ? '' : this.fieldName)
    + (this.fieldAlias ? ' AS ' + this.fieldAlias : '');
}

module.exports = Field;