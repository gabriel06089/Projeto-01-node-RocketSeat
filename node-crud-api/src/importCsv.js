const importTasksFromCSV = require("./utils/csvImport");
const path = require("path");

const filePath = path.join(__dirname, "tasks.csv"); // Caminho relativo para o arquivo CSV

importTasksFromCSV(filePath)
  .then(() => {
    console.log("Tasks imported successfully");
  })
  .catch((error) => {
    console.error("Error importing tasks:", error);
  });
