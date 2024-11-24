const http = require("http");
const taskRoutes = require("./routes/taskRoutes");

const server = http.createServer((req, res) => {
  taskRoutes(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
