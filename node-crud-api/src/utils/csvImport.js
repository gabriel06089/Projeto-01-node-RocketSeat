const fs = require("fs");
const { parse } = require("csv-parse");
const http = require("http");

const importTasksFromCSV = async (filePath) => {
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));

  for await (const record of parser) {
    const data = JSON.stringify({
      title: record.title,
      description: record.description,
    });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 201) {
        console.error(`Failed to create task: ${res.statusCode}`);
      }
    });

    req.on("error", (error) => {
      console.error(`Request error: ${error.message}`);
    });

    req.write(data);
    req.end();
  }
};

module.exports = importTasksFromCSV;
