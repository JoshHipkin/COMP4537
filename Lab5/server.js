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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-requested-with");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

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
      console.log(`server is running and listening on  http://localhost:${this.port}`);
    });
  }
}

const router = new Router();
//Add route for post ie. insert/update/delete
router.addRoute("/query", "POST", async (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { query } =   JSON.parse(body);

      if (query) {
        try {
          const results = await database.insert(query);
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify({success: true, data: results}));
        } catch (e) {
          res.writeHead(400, {"Content-Type": "application/json"});
          res.end(JSON.stringify({success: false, error: e.message}));
        }
      } else {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, error: "Query parameter is required"}));
      }
    } catch (e) {
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({success: false, error: "Invalid JSON in request body"}));
    }
  });
});

//Add route for get ie. Select
router.addRoute("/query", "GET", async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { query } = JSON.parse(body);

      if (query) {
        try {
          const results = await database.runQuery(query);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, data: results }));
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            error: "Query parameter is required",
          })
        );
      }
    } catch (e) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
        })
      );
    }
  });
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
