// Conexão com o MySQL.
// Ajuste usuário e senha conforme o MySQL da sua máquina.
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // ex.: 'root' ou a senha definida na instalação
  database: "gerenciador_eventos",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
