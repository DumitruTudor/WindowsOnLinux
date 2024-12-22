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
            security: "nla", // Network Level Authentication (NLA)
            "ignore-cert": "true", // Ignore server certificate errors
            "color-depth": "32", // True color (32-bit)
            "resize-method": "display-update", // Resize method: Display Update
            "enable-font-smoothing": "true", // Enable ClearType font smoothing
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
            "http://localhost:5173/api/session/data/postgresql/connections", // Replace "postgresql" with your data source
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
export default setupGuacamoleRDPConnection;