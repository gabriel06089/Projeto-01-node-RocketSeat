const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} = require("../controllers/taskController");

const taskRoutes = (req, res) => {
  const normalizedUrl = req.url.replace(/\/+/g, "/");
  console.log(`Requisição recebida: ${req.method} ${normalizedUrl}`);

  if (normalizedUrl === "/tasks" && req.method === "GET") {
    getTasks(req, res);
  } else if (normalizedUrl === "/tasks" && req.method === "POST") {
    createTask(req, res);
  } else if (normalizedUrl.match(/^\/tasks\/[^\/]+$/) && req.method === "PUT") {
    const id = normalizedUrl.split("/")[2];
    console.log(`Atualizando tarefa com ID: ${id}`);
    updateTask(req, res, id);
  } else if (normalizedUrl.match(/^\/tasks\/[^\/]+$/) && req.method === "DELETE") {
    const id = normalizedUrl.split("/")[2];
    console.log(`Deletando tarefa com ID: ${id}`);
    deleteTask(req, res, id);
  } else if (normalizedUrl.match(/^\/tasks\/[^\/]+\/complete$/) && req.method === "PATCH") {
    const id = normalizedUrl.split("/")[2];
    console.log(`Completando tarefa com ID: ${id}`);
    completeTask(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Rota não encontrada" }));
  }
};

module.exports = taskRoutes;