const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// TwiML endpoint
app.post("/twiml", (req, res) => {
  console.log("Twilio requested /twiml");

  const twiml = `
    <Response>
      <Start>
        <Stream url="wss://YOUR_PUBLIC_URL/twiliostream" />
      </Start>
      <Say>Welcome to WebSocket POC.</Say>
      <Pause length="60" />
    </Response>
  `;

  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

// HTTP + WebSocket server
const server = http.createServer(app);

// WebSocket listener
const wss = new WebSocketServer({ server, path: "/twiliostream" });

wss.on("connection", (ws) => {
  console.log("Twilio WebSocket connected.");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    console.log("WS Event:", data.event);
  });
});

// Start
server.listen(8080, () => console.log("Server running on 8080"));
