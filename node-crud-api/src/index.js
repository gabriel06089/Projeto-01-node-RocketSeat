const http = require("http");
const taskRoutes = require("./routes/taskRoutes");

const server = http.createServer((req, res) => {
  taskRoutes(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
