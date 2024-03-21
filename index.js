const WebSocket = require('ws');
const fs = require("fs");
// const conversationArray = require("./Services/PromptAI");

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
    console.log('Client connected to the WebSocket server');

    ws.on('message', (message) => {
        if (message instanceof Buffer) {
            // Handle binary data
            console.log('Received binary data');

            // Save the binary data to a file
            const filePath = './audioFile02.wav';
            fs.writeFile(filePath, Buffer.from(message), (err) => {
                if (err) {
                    console.error('Error saving audio file:', err);
                    return;
                }
                console.log(`Audio file saved to ${filePath}`);
            });
            console.log('Audio file saved to audioFile.wav');
            return;
        }

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
