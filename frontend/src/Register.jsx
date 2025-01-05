import React, { useState } from "react";
import setupGuacamoleRDPConnection from "../../backend/guacamole/guacamoleRdp.js";
import getEC2IPv4Address from "../../backend/aws/ec2.js";

const admin = import.meta.env.VITE_GUAC_ADMIN;
const adminpassword = import.meta.env.VITE_GUAC_PASS;

const Register = () => {
    const [formData, setFormData] = useState(
    {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

// Update state when form fields change
const handleInputChange = (e) => 
{
    const { name, value } = e.target;
    setFormData(
    {
        ...formData,
        [name]: value,
    });
};

// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // Check if passwords match
    if (password !== confirmPassword) 
    {
        alert("Passwords do not match");
        return;
    }

    const userData = { username, email, password};
    try 
    {
        // Send POST request to create IAM user
        const iamResponse = await fetch("http://localhost:3000/api/register", 
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (iamResponse.ok) 
        {
            const result = await iamResponse.json();
            alert(`User registered successfully! IAM User: ${result.iamUser.UserName}, SSM Command ID: ${result.ssmCommandId}`);
        } 
        else 
        {
            const errorData = await iamResponse.json();
            alert(`Error: ${errorData.message}`);
        }
    }
    catch(error)
    {
        // Handle error (e.g., when localhost:3000 is offline)
        console.warn("Localhost:3000 is offline. Skipping IAM registration.");
    }
    try
    {
        // Send POST request to create user in MongoDB
        const mongoResponse = await fetch(
            "http://localhost:5050/users/createUser",
            {
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }
            );
        
        if (mongoResponse.ok) 
        {
            const mongoResult = await mongoResponse.json();
            alert(`${mongoResult.username} registered successfully. An email has been sent to your email for verification.`);
            const EC2hostname = await getEC2IPv4Address();
            await setupGuacamoleRDPConnection(
            {
                adminUsername: admin,
                adminPassword: adminpassword,
                connectionName: `${username}-Windows`,
                hostname: EC2hostname,
                port: 3389,
                username: userData.username,
                password: userData.password
            }).then((connectionId) => console.log(`Guacamole RDP connection created successfully: ${connectionId}`)).catch((error)  => console.error("Failed to create connection:", error));

        } 
        else 
        {
            const errorData = await mongoResponse.json();
            alert(`Error: ${errorData.message}`);
        }
    }
    catch (error) 
    {
        console.error("Error:", error);
        alert("An error occurred during registration: " + error.message);
    }

};

return (
    <div className="register-container">
    <h2>Register</h2>
    <form id="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
        <label htmlFor="username">Username</label>
        <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
        />
        </div>
        <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
        />
        </div>
        <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
        />
        </div>
        <div className="input-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
        />
        </div>
        <div className="button-group">
        <button type="submit">Submit</button>
        </div>
    </form>
    </div>
);
};

export default Register;
