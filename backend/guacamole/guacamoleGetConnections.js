import { Buffer } from "buffer"; 
// Function for getting all connections
const getUserConnections = async (token) => 
{
    const response = await fetch("http://localhost:5173/api/session/data/postgresql/connections", {
        method: "GET",
        headers: { "Guacamole-Token": token },
});
    if (!response.ok) throw new Error("Failed to fetch connections.");

    const data = await response.json();
    return data;
};

// Filter connections based on the search criteria
export const findConnectionByName = (connections, searchName) => 
{
    // Find the first connection whose name includes the partial string (case-insensitive)
    const matchingConnection = Object.values(connections).find((connection) =>
        connection.name.toLowerCase().includes(searchName.toLowerCase())
    );
    if (!matchingConnection) {
        throw new Error(`No connection found matching the name "${searchName}"`);
    }

    return matchingConnection;
};
export const redirectToConnection = async (username, password, searchName, token) => 
{
    try
    {   
        // Step 1: Fetch all connections
        const connections = await getUserConnections(token);

        // Step 2: Find the specific connection
        const selectedConnection = findConnectionByName(connections, searchName);

        // Step 3: Generate the Guacamole URL
        const guacamoleUrl = `http://localhost:5173/guacamole/#/client/${selectedConnection.identifier}`;

        window.location.href = guacamoleUrl;
        } 
        catch (error) 
        {
            console.error("Error:", error.message);
        }
};
export default getUserConnections