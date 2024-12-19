import guacAuthenticate from "./guacamoleAuth.js";

const createRDPConnection = async (
    authToken,
    connectionName,
    hostname,
    port,
    username,
    password
) => 
    {
        const payload = {
            parentIdentifier: "ROOT", // The folder to store the connection (use "ROOT" for the default folder)
            name: connectionName,
            protocol: "rdp",
            parameters: {
            hostname,
            port: port.toString(),
            username,
            password,
            },
            attributes: {
                "max-connections": "",
                "max-connections-per-user": "",
                "guacd-encryption": "",
                "guacd-hostname": "",
                "guacd-port": ""
            }
        };        
        const response = await fetch(
            "http://localhost:8080/api/session/data/postgresql/connections", // Replace "postgresql" with your data source
        {   
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Guacamole-Token": `${authToken}`,
            },
            body: JSON.stringify(payload),
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create RDP connection: ${errorData.message}`);
    }
    const data = await response.json();
    return data.identifier; // The connection ID
}; 

const setupGuacamoleRDPConnection = async ({
    adminUsername,
    adminPassword,
    connectionName,
    hostname,
    port,
    username,
    password,
}) => {
    try {
        // Step 1: Authenticate with Guacamole
        const authToken = await guacAuthenticate(adminUsername, adminPassword);
        console.log("Authentication successful. Token:", authToken);
        // Step 2: Create the RDP connection
        const connectionId = await createRDPConnection(
            authToken,
            connectionName,
            hostname,
            port,
            username,
            password
    );

    console.log("RDP connection created successfully with ID:", connectionId);
    return connectionId;
} catch (error) {
    console.error("Error setting up Guacamole RDP connection:", error);
    throw error;
}
};
setupGuacamoleRDPConnection({
    adminUsername: "guacadmin", // Replace with your admin username
    adminPassword: "Scorpion19364513!", // Replace with your admin password
    connectionName: "My RDP Connection",
    hostname: "35.177.213.69", // Replace with the target RDP server's IP or hostname
    port: 3389, // Default RDP port
    username: "Administrator", // Replace with the RDP username
    password: "Smokeweed13!", // Replace with the RDP password
})
    .then((connectionId) => console.log("Connection created with ID:", connectionId))
    .catch((error) => console.error("Failed to create connection:", error));  
