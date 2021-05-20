const net = require("net");

const options = {
  port: 3020,
};

const client = net.createConnection(options, () => {
  client.write(JSON.stringify({ key: "hcm-hn", type: "A", amount: 2 }));
});

client.on("data", (data) => {
  const res = JSON.parse(data.toString() ?? "{}");
  console.log(res);
});
