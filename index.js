const inquirer = require('inquirer')
const express = require("express")
const cTable = require("console.table")
const mysql = require('mysql2')


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: //'',
      database: 'tracker_db'
  },
  
)

const questions = () => {
  inquirer
  .prompt({
    type: "list",
    message: "What would you like to do?",
    name: "catalog",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
  }).then ((data) => {
    // Using switch statement with default value to get the table once a view is selected
    switch(data.catalog) {
        case 'view all departments':{
            showDepartment()
            break
        }
        case 'view all roles': {
            showRoles()
            break
        }
        case 'view all employees': {
            showEmployee()
            break
        }
        case 'add a department': {
            addDepartment()
            break
        }
        case 'add a role': {
            addRole()
            break
        }
        case 'add an employee': {
            addEmployee()
            break
        }
        case 'update an employee role': {
            updateEmployeeRole()
            break
        }
        default: return console.log('Make a selection')
    }
  })
};


function showDepartment() {
  const sql = 'select id, name from department;'
  db.query(sql,(err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('\n')
      console.log(cTable.getTable(data))
      questions()
    }
  })
}

function showRoles() {
  const sql = 'select role.id, role.title,role.salary, department.name AS Department from role INNER JOIN department ON role.department_id = department.id;'
  db.query(sql,(err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('\n')
      console.log(cTable.getTable(data))
      questions()
    }
  })
}

function showEmployee() {
  const sql = 'select employee.first_name, employee.last_name, department.name AS department, role.salary AS salary, role.title from employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;'
  db.query(sql,(err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('\n')
      console.log(cTable.getTable(data))
      questions()
    }
  })
}

const addRole = () =>{
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the NEW role?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary amount (USD) for the NEW role?'
    },
    {
      type: 'input',
      name: 'department',
      message: 'What department does the NEW role fall under?'
    }
  ]).then((data) => {
    const sql = 'insert into role (title, salary, department_id) Values (?,?,?);'
    const parameter = [data.title, data.salary, data.department]
    db.query(sql, parameter, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('\n')
        console.log(cTable.getTable(data))
        questions()
      }
    })
  })
}


const addDepartment = () =>{
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the NEW department?'
    }
  ]).then((data) => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const parameter = [data.department]
    db.query(sql,parameter, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('\n')
        console.log(cTable.getTable(data))
        showDepartment()
        questions()
      }
    })
  })
}

const addEmployee = () =>{
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employee First Name?'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the employee Last Name?'
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'What is the employee"s role?'
    },
   
  ]).then((data) => {
    const sql = 'insert into employee (first_name, last_name, role_id, manager_id) Values (?,?,?,NULL);'
    const parameter = [data.first_name, data.last_name, data.role_id]
    db.query(sql, parameter, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('\n')
        console.log(cTable.getTable(data))
        questions()
      }
    })
  })
}

const updateEmployeeRole = () =>{
 
  const employeeUpdate = inquirer.prompt([
    {
      type: "input",
      name:'employee_id',
      message: "Which employee are you updating?",
      // choices: ['']
    },
    {
      type: "input",
      name: "role_id",
      message: "what is the new role of the employee?",
      // choices: ['view all roles'] 
    }
  ]).then((data) => {
    const sql = 'update employee set role_id = ? where id = ?;' 
    const parameter = [data.role_id, data.employee_id]
    db.query(sql, parameter, (err, data)=>{
      if (err) {
        console.log(err)
      } else {
        console.log('\n')
        console.log(cTable.getTable(data))
        showEmployee()
        questions()
      }
    })
  })
}

questions()


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});