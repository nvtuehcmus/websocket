train tickets manager

---

---
how to run that project ?<br>
make sure node v14.16.0 is really exists on your machine<br>
1: clone project following command: <br>git clone git@github.com:nvtuehcmus/websocket.git<br>
2: run command:" yarn" or "npm install" recommend "yarn" make sure yarn install global
<br>
3: if everything going be ok, try "yarn start" to run server<br>
4: "node client/client" to run client script
---- 
client using reactjs for UI javascript for back-end
react app will send http request to proxy(client BE)
proxy create ws connection to server,
server call to database to get data and send to proxy in ws protocol and then 
proxy send to UI in http protocol,
I store data in mongodb 
when client connect server will create a connection and connect until process is end
, so you can create a lot of request at the same time ,
in server using nodejs  client want to update database, nodejs will push them to callback queue (v8 engine), that will solve multiple thread issues
<br>total score: 12 