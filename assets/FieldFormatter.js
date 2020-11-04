const mysql = require('mysql2/promise');

class FieldFormatter {
  constructor(fieldName, tableName, tableAlias) {
    this.fieldName = mysql.escapeId(fieldName);
    if (tableName) this.tableName = tableName;
    if (tableAlias) this.tableAlias = mysql.escapeId(tableAlias);
  }
}

FieldFormatter.prototype.setCustom = function(custom) {
  this.custom = custom;
  return this;
}

FieldFormatter.prototype.setAlias = function(fieldAlias) {
  this.fieldAlias = mysql.escape(fieldAlias);
  return this;
}

FieldFormatter.prototype.formatFieldForQuery = function () {
  return (this.custom ? this.custom
      :  this.tableAlias ? this.tableAlias + '.'
      : this.tableName ? this.tableName + '.'
      : '')
    + (this.custom ? '' : this.fieldName)
    + (this.fieldAlias ? ' AS ' + this.fieldAlias : '');
}

module.exports = FieldFormatter;