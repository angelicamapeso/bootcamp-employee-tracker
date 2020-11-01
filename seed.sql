USE employee_db;

INSERT INTO department(name)
	VALUES('Sales'),
		('Engineering'),
        ('Finance'),
        ('Legal');
        
INSERT INTO role(title, salary, department_id)
	VALUES('Sales Lead', 100000, 1),
		('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 125000, 2),
        ('Account Manager', 300000, 3),
        ('Accountant', 250000, 3),
        ('Legal Team Lead', 250000, 4),
        ('Lawyer', 190000, 4);

-- Managers
INSERT INTO employee(first_name, last_name, role_id, manager_id)
	VALUES('Martine', 'Pace', 1, NULL),
		('Shuaib', 'Collier', 3, NULL),
        ('Mohamed', 'Whitaker', 5, NULL),
        ('Philip', 'Mcknight', 7, NULL);

-- Employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
	VALUES('Hibah', 'Goldsmith', 2, 1),
	('Christiana', 'Hester', 4, 2),
    ('Bertram', 'Churchill', 6, 3),
    ('Forrest', 'Delarosa', 8, 4);
