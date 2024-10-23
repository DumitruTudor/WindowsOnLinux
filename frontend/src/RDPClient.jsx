// src/components/RDPClient.js
import React, { useEffect, useRef } from 'react';

const RDPClient = () => {
    const canvasRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Connect to the WebSocket server (assuming WebSocket server is on the same host)
        wsRef.current = new WebSocket('ws://localhost:3000');
        
        // Handle incoming messages (bitmap updates)
        wsRef.current.onmessage = (event) => {
            const bitmap = JSON.parse(event.data);
            const imageData = context.createImageData(bitmap.width, bitmap.height);
        
            // Populate the ImageData object with bitmap data
            for (let i = 0; i < bitmap.data.length; i++) {
                imageData.data[i] = bitmap.data[i];
            }
        
            // Draw the image data on the canvas
            context.putImageData(imageData, 0, 0);
        };
        
        // Cleanup WebSocket connection when the component is unmounted
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

return (
    <div>
        <h1>RDP Connection</h1>
        <canvas ref={canvasRef} width="1024" height="768"></canvas>
    </div>
);};
export default RDPClient;
