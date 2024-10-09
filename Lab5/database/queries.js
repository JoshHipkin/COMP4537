const database = require("../utils/dbConnection");

async function runQuery(query) {
  const forbiddenKeywords = ["DELETE", "UPDATE", "DROP", "ALTER", "TRUNCATE"];
  if (
    forbiddenKeywords.some((keyword) => query.toUpperCase().include(keyword))
  ) {
    throw new Error("403");
  }

  if (!query.toUpperCase().includes("LIMIT")) {
    query += " LIMIT 100";
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
  CREATE TABLE IF NOT EXISTS Patient ()
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATETIME NOT NULL);
  `;
}

module.exports = {
  runQuery,
  getPatients,
};
