const { v4: uuidv4 } = require("uuid");
const tasks = require("../models/taskModel");

const getTasks = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(tasks));
};

const createTask = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { title, description } = JSON.parse(body);

      if (!title || !description) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Title and description are required" })
        );
        return;
      }

      const newTask = {
        id: uuidv4(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      tasks.push(newTask);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newTask));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};

const updateTask = (req, res, id) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { title, description } = JSON.parse(body);

      if (!title || !description) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Title and description are required" })
        );
        return;
      }

      const task = tasks.find((task) => task.id === id);

      if (task) {
        task.title = title;
        task.description = description;
        task.updated_at = new Date();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(task));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Task Not Found" }));
      }
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};

const deleteTask = (req, res, id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task Deleted" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task Not Found" }));
  }
};

const completeTask = (req, res, id) => {
  const task = tasks.find((task) => task.id === id);

  if (task) {
    task.completed_at = task.completed_at ? null : new Date();
    task.updated_at = new Date();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(task));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task Not Found" }));
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
};
