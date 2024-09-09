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
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Capture the form data
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Create a user object to send to the backend
    const userData = {
        username,
        email,
        password
    };

    try {
        // Send a POST request to the backend to create the user
        const response = await fetch("http://localhost:8080/users/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            alert("User registered successfully!");
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration");
    }
});
