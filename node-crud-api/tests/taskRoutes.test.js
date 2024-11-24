const http = require("http");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const importTasksFromCSV = require("../src/utils/csvImport");

const BASE_URL = "http://localhost:3000";

describe("Task Routes", () => {
  it("should return 200 for GET /tasks", (done) => {
    http.get(`${BASE_URL}/tasks`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });
  });

  it("should create a new task with POST /tasks", (done) => {
    const data = JSON.stringify({
      title: "New Task",
      description: "Description of the new task",
    });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = http.request(options, (res) => {
      assert.strictEqual(res.statusCode, 201);

      let body = "";
      res.on("data", (chunk) => {
        body += chunk.toString();
      });

      res.on("end", () => {
        const task = JSON.parse(body);
        assert.strictEqual(task.title, "New Task");
        assert.strictEqual(task.description, "Description of the new task");
        done();
      });
    });

    req.write(data);
    req.end();
  });

  it("should update a task with PUT /tasks/:id", (done) => {
    // Create a task first
    const createData = JSON.stringify({
      title: "Task to Update",
      description: "Description of the task to update",
    });

    const createOptions = {
      hostname: "localhost",
      port: 3000,
      path: "/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": createData.length,
      },
    };

    const createReq = http.request(createOptions, (createRes) => {
      assert.strictEqual(createRes.statusCode, 201);

      let createBody = "";
      createRes.on("data", (chunk) => {
        createBody += chunk.toString();
      });

      createRes.on("end", () => {
        const createdTask = JSON.parse(createBody);

        // Now update the created task
        const updateData = JSON.stringify({
          title: "Updated Task",
          description: "Updated description",
        });

        const updateOptions = {
          hostname: "localhost",
          port: 3000,
          path: `/tasks/${createdTask.id}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": updateData.length,
          },
        };

        const updateReq = http.request(updateOptions, (updateRes) => {
          assert.strictEqual(updateRes.statusCode, 200);

          let updateBody = "";
          updateRes.on("data", (chunk) => {
            updateBody += chunk.toString();
          });

          updateRes.on("end", () => {
            const updatedTask = JSON.parse(updateBody);
            assert.strictEqual(updatedTask.title, "Updated Task");
            assert.strictEqual(updatedTask.description, "Updated description");
            done();
          });
        });

        updateReq.write(updateData);
        updateReq.end();
      });
    });

    createReq.write(createData);
    createReq.end();
  });

  it("should delete a task with DELETE /tasks/:id", (done) => {
    // Create a task first
    const createData = JSON.stringify({
      title: "Task to Delete",
      description: "Description of the task to delete",
    });

    const createOptions = {
      hostname: "localhost",
      port: 3000,
      path: "/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": createData.length,
      },
    };

    const createReq = http.request(createOptions, (createRes) => {
      assert.strictEqual(createRes.statusCode, 201);

      let createBody = "";
      createRes.on("data", (chunk) => {
        createBody += chunk.toString();
      });

      createRes.on("end", () => {
        const createdTask = JSON.parse(createBody);

        // Now delete the created task
        const deleteOptions = {
          hostname: "localhost",
          port: 3000,
          path: `/tasks/${createdTask.id}`,
          method: "DELETE",
        };

        const deleteReq = http.request(deleteOptions, (deleteRes) => {
          assert.strictEqual(deleteRes.statusCode, 200);

          let deleteBody = "";
          deleteRes.on("data", (chunk) => {
            deleteBody += chunk.toString();
          });

          deleteRes.on("end", () => {
            const response = JSON.parse(deleteBody);
            assert.strictEqual(response.message, "Task Deleted");
            done();
          });
        });

        deleteReq.end();
      });
    });

    createReq.write(createData);
    createReq.end();
  });

  it("should mark a task as complete with PATCH /tasks/:id/complete", (done) => {
    // Create a task first
    const createData = JSON.stringify({
      title: "Task to Complete",
      description: "Description of the task to complete",
    });

    const createOptions = {
      hostname: "localhost",
      port: 3000,
      path: "/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": createData.length,
      },
    };

    const createReq = http.request(createOptions, (createRes) => {
      assert.strictEqual(createRes.statusCode, 201);

      let createBody = "";
      createRes.on("data", (chunk) => {
        createBody += chunk.toString();
      });

      createRes.on("end", () => {
        const createdTask = JSON.parse(createBody);

        // Now mark the created task as complete
        const completeOptions = {
          hostname: "localhost",
          port: 3000,
          path: `/tasks/${createdTask.id}/complete`,
          method: "PATCH",
        };

        const completeReq = http.request(completeOptions, (completeRes) => {
          assert.strictEqual(completeRes.statusCode, 200);

          let completeBody = "";
          completeRes.on("data", (chunk) => {
            completeBody += chunk.toString();
          });

          completeRes.on("end", () => {
            const completedTask = JSON.parse(completeBody);
            assert.strictEqual(completedTask.completed_at !== null, true);
            done();
          });
        });

        completeReq.end();
      });
    });

    createReq.write(createData);
    createReq.end();
  });

  it("should import tasks from CSV file", async () => {
    const filePath = path.join(__dirname, "tasks.csv");
    fs.writeFileSync(
      filePath,
      "title,description\nTask 06,Descrição da Task 06\nTask 07,Descrição da Task 07"
    );

    await importTasksFromCSV(filePath);

    http.get(`${BASE_URL}/tasks`, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk.toString();
      });

      res.on("end", () => {
        const tasks = JSON.parse(body);
        const importedTasks = tasks.filter(
          (task) => task.title === "Task 06" || task.title === "Task 07"
        );
        assert.strictEqual(importedTasks.length, 2);
        fs.unlinkSync(filePath); // Clean up the test file
      });
    });
  });
});
