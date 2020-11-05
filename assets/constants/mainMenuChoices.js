//Constants to be used in the main menu and
//accessed as function options in index
const mainMenuChoices = {
  tables: ['Departments', 'Roles', 'Employees'],
  departmentActions: ['Add department', 'View departments', 'View utilized budget of a department', 'Delete department'],
  roleActions: ['Add role', 'View roles', 'Delete role'],
  employeeActions: ['Add employee', 'View employees', 'View employees by manager','Delete employee', 'Update employee role', 'Update employee manager'],
  quit: 'Quit',
}

module.exports = mainMenuChoices;