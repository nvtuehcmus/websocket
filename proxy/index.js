const net = require("net");
const bodyParser = require("body-parser");
const express = require("express");

const proxy = express();
proxy.all("*", (req, res, next) => {
  /**
   * Response settings
   * @type {Object}
   */
  const responseSettings = {
    AccessControlAllowOrigin: req.headers.origin,
    AccessControlAllowHeaders:
      "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, Authentication",
    AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
    AccessControlAllowCredentials: true,
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Origin",
    responseSettings.AccessControlAllowOrigin
  );
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
      ? req.headers["access-control-request-headers"]
      : "x-requested-with"
  );
  res.header(
    "Access-Control-Allow-Methods",
    req.headers["access-control-request-method"]
      ? req.headers["access-control-request-method"]
      : responseSettings.AccessControlAllowMethods
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});
proxy.get("/", bodyParser.json(), (req, res) => {
  const client = net.createConnection({ port: 3020 }, () => {
    client.write("get-info");
  });

  client.on("data", (data) => {
    const result = JSON.parse(data.toString() ?? "{}");
    return res.send(result);
  });
});

proxy.post("/buy", bodyParser.json(), (req, res) => {
  const client = net.createConnection({ port: 3020 }, () => {
    client.write(JSON.stringify(req.body));
  });

  client.on("data", (data) => {
    const result = JSON.parse(data.toString() ?? "{}");
    return res.send(result);
  });
});

proxy.listen(8080, () => {
  console.log("proxy running on 8080");
});
