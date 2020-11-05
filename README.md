# Bootcamp - Homework 10: Employee Tracker

A command line application to manage the Departments, Roles and Employees of a company.

## Functions
The following actions may be performed with the application:

### Add
- Add departments, roles and employees

### View
- View departments, roles and employees
- View total utilized budget of a department
- View employees by manager

### Update
- Update employee roles
- Update employee managers

### Delete
- Delete departments, roles and employees


All information is stored, retrieved and modified using MySQL.

A user story and acceptance criteria were provided for this assignment, but no starter code was given.

## Purpose
According to the user story, this application is meant for business owners seeking to organize and plan their business by managing their company information.

## Installation
1. Run `npm install` before using. This application uses: [Inquirer](https://www.npmjs.com/package/inquirer), [Node MySQL 2](https://www.npmjs.com/package/mysql2) and [console.table](https://www.npmjs.com/package/console.table).
2. Set up the database using the files found in [`sql`](./sql). A [`seed.sql`](./sql/seed.sql) file is provided for dummy data.
3. Configure the `user` and `password` properties found in [`connectionDetails.js`](./assets/constants/connectionDetails.js).

## Usage
Run `node index` to start the application and follow the series of prompts.

## Built with
- [Node.js](https://nodejs.org/en/)
- [Inquirer](https://www.npmjs.com/package/inquirer)
- [Node MySQL 2](https://www.npmjs.com/package/mysql2)
- [console.table](https://www.npmjs.com/package/console.table)

This homework assignment is part of the [Carleton University Coding Bootcamp](https://bootcamp.carleton.ca/).