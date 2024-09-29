const message = require("./lang/en/en");
const utils = require("./modules/utils");

const http = require("http");
const url = require("url");
const fs = require("fs");

class Router {
  constructor() {
    this.routes = {};
  }

  addRoute(path, method, handler) {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }
    this.routes[path][method] = handler;
  }

  getHandler(path, method) {
    if (this.routes[path] && this.routes[path][method]) {
      return this.routes[path][method];
    } else {
      return null;
    }
  }
}

class Server {
  constructor(port, router) {
    this.port = port;
    this.router = router;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    const handler = this.router.getHandler(path, method);
    if (handler) {
      handler(req, res);
    } else {
      res.writeHead(404, { "content-type": "text/html" });
      res.end("<h1>404 page not found</h1>");
    }
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`server is running and listening on port ${this.port}`);
    });
  }
}

const router = new Router();
router.addRoute("/", "GET", (req, res) => {
  const query = url.parse(req.url, true).query;
  const name = query.name || "guest";

  const currentDate = utils.getDate();

  const display = `<h1 style="color: blue;">${message.MESSAGE.replace(
    "%1",
    name
  )} ${currentDate}</h1>`;
  res.writeHead(200, { "content-type": "text/html" });
  res.end(display);
});
router.addRoute("/writeFile", "GET", (req, res) => {
  const query = url.parse(req.url, true).query;
  let text = query.text;

  if (fs.existsSync("file.txt")) {
    text = `\n${text}`;
  }

  fs.appendFile("file.txt", text, (error) => {
    if (error) {
      res.writeHead(400, { "content-type": "text/html" });
      res.end("<h1>Failed to write to file</h1>");
    } else {
      res.writeHead(200, { "content-type": "text/html" });
      res.end("<h1>Success writing to file</h1>");
    }
  });
});
router.addRoute("/readFile/file.txt", "GET", (req, res) => {
  fs.readFile("file.txt", "utf8", (error, data) => {
    if (error) {
      res.writeHead(404, { "content-type": "text/html" });
      res.end("<h1>404, file not found</h1>");
    } else {
      const formattedData = data.replace(/\n/g, "<br>");
      res.writeHead(200, { "content-type": "text/html" });
      res.end(formattedData);
    }
  });
});

const port = 3030;
const server = new Server(port, router);
server.start();
