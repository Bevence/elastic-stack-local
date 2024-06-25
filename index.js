const http = require("http");
const { Client } = require("@elastic/elasticsearch");
const books = require("./data");

const client = new Client({
  node: "https://es01:9200/",
  auth: {
    apiKey: "WsH7F9pmQ2aZbwMQDrLsMQ",
  },
});

const server = http.createServer(async (req, res) => {
  if (req.url === "/ping") {
    if (req.method === "GET") {
      res.write("pong");
      res.end();
    }
  }

  if (req.url === "/injest/elastic-stack") {
    if (req.method === "GET") {
      try {
        const result = await client.helpers.bulk({
          datasource: books,
          onDocument: (doc) => ({ index: { _index: "books" } }),
        });
        res.write(result);
        res.end();
      } catch (error) {
        console.log("error", error);
        res.write("Something went wrong");
        res.end();
      }
    }
  }

  if (req.url === "/fetch/elastic-stack") {
    if (req.method === "GET") {
      try {
        const result = await client.search();
        res.write(result);
        res.end();
      } catch (error) {
        console.log("error", error);
        res.write("Something went wrong");
        res.end();
      }
    }
  }

  if (req.url) {
    res.write("Not Found");
    res.end();
  }
});

server.listen(4000, () => {
  console.log("server starting on port 4000");
});
