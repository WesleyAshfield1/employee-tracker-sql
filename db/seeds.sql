INSERT INTO department (name)
VALUES 
    ("Marketing"),
    ("Management");

INSERT INTO role (title, salary, department_id)
VALUES
    ("social", 50000, 1),
    ("sales", 60000, 1),
    ("district",80000, 2),
    ("upper", 90000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Smith", 1, 1)
    ("Jane", "Doe", 2, 2)
    ("Jimmy", "Hendricks", 3, 2)