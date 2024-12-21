import React, { useEffect, useRef } from 'react';
import Guacamole from 'guacamole-common-js';
import './Style.css';

const GuacamoleComponent = () => 
{
    const guacContainerRef = useRef(null);
    let guacClient = null;

    useEffect(() => 
    {
        // Initialize Guacamole client
        const tunnel = new Guacamole.HTTPTunnel('http://localhost:5173/guacamole/tunnel');
        guacClient = new Guacamole.Client(tunnel);

    // Attach the display to the container
    if (guacContainerRef.current) 
    {
        guacContainerRef.current.appendChild(guacClient.getDisplay().getElement());
    }
    guacClient.connect();

    // Handle disconnect on component unmount
    return () => 
    {
        if (guacClient) 
        {
            guacClient.disconnect();
            guacClient = null;
        }
    };
}, []);

return (
    <div className="guacamole-container">
    <div
        id="guac-container"
        ref={guacContainerRef}
        style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
    ></div>
    </div>
);
};
export default GuacamoleComponent;
