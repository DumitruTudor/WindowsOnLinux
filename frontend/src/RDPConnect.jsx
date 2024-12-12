import React, { useEffect, useRef } from 'react';
import Guacamole from 'guacamole-common-js';

const RDPConnect = () => 
{
    const guacContainerRef = useRef(null);
    const authenticate = async (username, password) => 
    {
        const response = await fetch("http://localhost:8080/guacamole/api/tokens", 
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) 
        {
            throw new Error("Authentication failed.");
        }
    const data = await response.json();
    return data.authToken;
    };

    const createRDPConnection = async (authToken, name, hostname, port, username, password) => {
    const payload = 
    {
        parentIdentifier: "ROOT",
        name: name,
        protocol: "rdp",
        parameters: {
        hostname: hostname,
        port: port.toString(),
        username: username,
        password: password,
        },
    };

    const response = await fetch("http://localhost:8080/guacamole/api/session/data/mysql/connections", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) 
    {
        throw new Error("Failed to create RDP connection.");
    }

    const data = await response.json();
    return data.identifier;
};

    const connectRDP = (authToken, connectionId) => 
    {
        const tunnel = new Guacamole.HTTPTunnel(`/guacamole/tunnel?token=${authToken}&connection=${connectionId}`);
        const client = new Guacamole.Client(tunnel);

    if (guacContainerRef.current) 
    {
        guacContainerRef.current.appendChild(client.getDisplay().getElement());
    }

    client.connect();

    window.onunload = () => 
    {
        client.disconnect();
    };
};

useEffect(() => {
    const setupRDPConnection = async () => 
    {
        const guacUsername = "your-guac-username"; // Replace with your Guacamole username
        const guacPassword = "your-guac-password"; // Replace with your Guacamole password

    const rdpDetails = 
    {
        name: "My RDP Connection",
        hostname: "192.168.1.100", // Replace with your RDP server's hostname or IP
        port: 3389, // RDP default port
        username: "rdp-user", // Replace with your RDP username
        password: "rdp-password", // Replace with your RDP password
    };

    try 
    {
        // Authenticate and get token
        const authToken = await authenticate(guacUsername, guacPassword);

        // Create the RDP connection
        const connectionId = await createRDPConnection(
            authToken,
            rdpDetails.name,
            rdpDetails.hostname,
            rdpDetails.port,
            rdpDetails.username,
            rdpDetails.password
        );

        // Connect to the RDP session
        connectRDP(authToken, connectionId);
    } 
    catch (error) 
    {
        console.error("Error setting up RDP connection:", error);
    }
    };

    setupRDPConnection();
}, []);

return (
    <div
        id="guac-container"
        ref={guacContainerRef}
        style={{ width: "100%", height: "100%", background: "black" }}
    ></div>
);
};

export default RDPConnect;
