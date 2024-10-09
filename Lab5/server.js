require("dotenv").config();
const http = require("http");
const url = require("url");
const database = require("./database/queries");

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
//Add route for post ie. insert/update/delete

//Add route for get ie. Select
router.addRoute("/query", "GET", async (req, res) => {
  const query = req.body.query;

  try {
    const results = await database.runQuery(query);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ success: true, data: results }));
  } catch (e) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: e.message }));
  }
});

router.addRoute("/select*frompatient", "GET", async (req, res) => {
  try {
    const results = await database.getPatients();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, data: results }));
  } catch (e) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: e.message }));
  }
});

const port = 3000;
const server = new Server(port, router);
server.start();
