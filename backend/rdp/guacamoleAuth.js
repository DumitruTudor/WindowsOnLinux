// Function to authenticate with Guacamole
const guacAuthenticate = async (adminUsername, adminPassword) => {
    const response = await fetch("http://localhost:8080/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            username: adminUsername,
            password: adminPassword,
        }),
    });
    
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to authenticate with Guacamole.");
    }

    const data = await response.json();
    return data.authToken;
};
export default guacAuthenticate;