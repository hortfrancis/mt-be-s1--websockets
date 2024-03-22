const WebSocket = require('ws');
const fs = require("fs");
// const conversationArray = require("./Services/PromptAI");
const { transcribeGujarati, transcribeEnglish } = require("./Services/SpeechToText");

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
    console.log('Client connected to the WebSocket server');
    let expectBinary = false;
    console.log('(11) expectBinary:', expectBinary);

    ws.on('message', (message) => {
        if (expectBinary) {
            console.log('Received binary data');
            // Handle binary audio data ... 
            console.log('(17) expectBinary:', expectBinary);

            (async () => {
                try {
                    const transcribedEnglish = await transcribeEnglish(message);
                    console.log("Transcribed English:", transcribedEnglish);
                    const transcribedGujarati = await transcribeGujarati(message);
                    console.log("Transcribed Gujarati:", transcribedGujarati);

                    ws.send(JSON.stringify({
                        message: {
                            type: 'user transcription',
                            content: {
                                englishTranscription: transcribedEnglish,
                                gujaratiTranscription: transcribedGujarati
                            }
                        }
                    }));
                } catch (error) {
                    console.error("Error transcribing English:", error);
                }
            })();

            // Reset the expectation for the next message
            expectBinary = false;


            // // Save the binary data to a file
            // const filePath = './audioFile01.wav';
            // fs.writeFile(filePath, Buffer.from(message), (err) => {
            //     if (err) {
            //         console.error('Error saving audio file:', err);
            //         return ws.send(JSON.stringify({ error: 'File writing error' }));
            //     }
            //     // Reset the expectation for the next message
            //     expectBinary = false;
            //     console.log(`Audio file saved to ${filePath}`);
            //     ws.send(JSON.stringify({ message: 'Audio file processed' }));
            // });
            // return;
        } else {
            // Assuming the message is text and attempting to parse it
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'audio') {
                    console.log('Switch to receive audio data');
                    expectBinary = true;
                    ws.send(JSON.stringify({ mode: 'audio' }));
                    return;
                } else {
                    console.log('Received text data:', data);
                    ws.send(JSON.stringify({ message: "The backend says hello!" }));
                }
            } catch (error) {
                console.error("Error parsing JSON data:", error);
            }
            // console.log(`Received message: ${message}`);
            // ws.send('The backend says hello!');
        }

        // console.log(`Received message: ${message}`);
        // ws.send('The backend says hello!');
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    //   // Optionally, you could send conversation history on new connection
    //   ws.send(JSON.stringify(conversationArray));
});

console.log(`WebSocket server is listening on port 3001`);
