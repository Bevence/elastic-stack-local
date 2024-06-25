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
      console.log("books", books);
      const result = await client.helpers.bulk({
        datasource: books,
        onDocument: (doc) => ({ index: { _index: "books" } }),
      });
      res.write(result);
      res.end();
    }
  }

  res.write("Not Found");
  res.end();
});

server.listen(4000, () => {
  console.log("server starting on port 4000");
});
