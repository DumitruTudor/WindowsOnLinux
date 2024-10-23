import RDP from "node-rdpjs";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

export function rdpConnect(server)
{
    const wss = new WebSocket.Server({ port: 8080 });
    wss.on('connection', (ws) => 
    {
        console.log('WebSocket client connected');
        
        // create RDP Client
        const rdpClient = RDP.createClient(
        {
            domain: process.env.RDP_DOMAIN, //replace with EC2 domain
            userName: process.env.RDP_USERNAME, //replace with EC2 username
            password: process.env.RDP_PASSWORD, //replace with EC2 password
            enableAudio: true,
            enablePerf: true,
            screen: {
                width: 1024,
                height: 768 // screen resolution
            },
            locale: 'en-us',
            logLevel: 'warn' 
        })

        // send bitmap (screen updates) to WebSocket Client
        rdpClient.on('bitmap', (bitmap) =>
        {
            ws.send(JSON.stringify(bitmap)); // send the data to the client 
        });

        // handle WebSocket messages from client (i.e mouse & keyboard)
        ws.on('message', (message) =>
        {
            const data = JSON.parse(message);
            if (data.type === 'mouse')
            {
                rdpClient.sendMouse(data.x, data.y, data.button);
            }
            else if (data.type === 'keyboard')
            {
                rdpClient.sendKey(data.keyCode, data.isDown);
            }
        });

        // handle WebSocket dissconnection
        ws.on("close", () =>
        {
            console.log("WebSocket client disconnected");
            rdpClient.close(); // close the RDP client
        });

        // handle RDP connection errors
        rdpClient.on('error', (err) =>
        {
            console.error('RDP client error:', err);
            ws.close(); // close the WebSocket connection
        });

        // start the RDP session
        rdpClient.connect();
    });
}