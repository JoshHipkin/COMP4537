const database = require("../utils/dbConnection");

async function runQuery(query) {
  const forbiddenKeywords = ["DELETE", "UPDATE", "DROP", "ALTER", "TRUNCATE"];
  if (
    forbiddenKeywords.some((keyword) => query.toUpperCase().includes(keyword))
  ) {
    throw new Error("403");
  }
  try {
    const results = await database.query(query);
    return results[0];
  } catch (e) {
    console.error("error executing query: ", e);
    throw e;
  }
}

async function getPatients() {
  const query = `SELECT * FROM Patient LIMIT 100;`;
  try {
    const results = await database.query(query);
    return results[0];
  } catch (e) {
    console.error("Error running patient query:", e);
    throw e;
  }
}

async function insert(query) {
  const createTable = `
  CREATE TABLE IF NOT EXISTS Patient (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATETIME NOT NULL);
  `;
  try {
    await database.query(createTable);
    const results = await database.query(query);
    return results[0];
  } catch (e) {
    console.error("error running query:", e);
    throw e;
  }
}

module.exports = {
  runQuery,
  getPatients,
  insert,
};
