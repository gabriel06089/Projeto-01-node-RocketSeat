const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} = require("../controllers/taskController");

const taskRoutes = (req, res) => {
  // Normalizar a URL removendo barras duplas
  const normalizedUrl = req.url.replace(/\/+/g, "/");
  console.log(`Received request: ${req.method} ${normalizedUrl}`); // Log para depuração

  if (normalizedUrl === "/tasks" && req.method === "GET") {
    getTasks(req, res);
  } else if (normalizedUrl === "/tasks" && req.method === "POST") {
    createTask(req, res);
  } else if (normalizedUrl.match(/\/tasks\/[^\/]+$/) && req.method === "PUT") {
    const id = normalizedUrl.split("/")[2];
    console.log(`Updating task with ID: ${id}`); // Log para depuração
    updateTask(req, res, id);
  } else if (
    normalizedUrl.match(/\/tasks\/[^\/]+$/) &&
    req.method === "DELETE"
  ) {
    const id = normalizedUrl.split("/")[2];
    console.log(`Deleting task with ID: ${id}`); // Log para depuração
    deleteTask(req, res, id);
  } else if (
    normalizedUrl.match(/\/tasks\/[^\/]+\/complete$/) &&
    req.method === "PATCH"
  ) {
    const id = normalizedUrl.split("/")[2];
    console.log(`Completing task with ID: ${id}`); // Log para depuração
    completeTask(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  }
};

module.exports = taskRoutes;
