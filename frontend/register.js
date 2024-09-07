// Select the form element
const form = document.getElementById('register-form');

// Add an event listener to handle form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the username value from the input field
    const username = document.getElementById('username').value;

    // Prepare the data to be sent to the backend
    const userData = { username };

    try {
        // Send a POST request to the backend API to create the IAM user
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // Send the username as JSON
        });

        // Parse the response
        const result = await response.json();

        // Handle success or error
        if (response.ok) {
            alert("User created successfully: " + result.user.UserName);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error creating IAM user: " + error.message);
    }
});
