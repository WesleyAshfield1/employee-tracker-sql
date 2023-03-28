const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tracker_db'
  });