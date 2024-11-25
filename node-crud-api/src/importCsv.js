const importTasksFromCSV = require("./utils/csvImport");
const path = require("path");

const filePath = path.join(__dirname, "tasks.csv");

importTasksFromCSV(filePath)
  .then(() => {
    console.log("Tarefas importadas com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao importar tarefas:", error);
  });