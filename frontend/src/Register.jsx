import React, { useState } from "react";
import "./Style.css"; // Assuming you have the CSS file for styling

const Register = () => 
{
    // Local state to store form data
    const [formData, setFormData] = useState(
    {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

// Handle input change
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
const handleSubmit = (e) => 
{
    e.preventDefault();
    // You can add validation logic here
    console.log("Form submitted:", formData);
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
            <label htmlFor="confirm-password">Confirm Password</label>
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
