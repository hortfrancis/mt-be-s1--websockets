const WebSocket = require('ws');
// const conversationArray = require("./Services/PromptAI");

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Client connected to the WebSocket server');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send('The backend says hello!');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

//   // Optionally, you could send conversation history on new connection
//   ws.send(JSON.stringify(conversationArray));
});

console.log(`WebSocket server is listening on port 3001`);
