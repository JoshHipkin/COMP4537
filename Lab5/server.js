const http = require("http");
const url = require("url");

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
    if (this.routes[path] && this.routes[path][nethod]) {
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
