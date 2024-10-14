import React, { useState } from 'react';
import './Style.css'; // Assuming you have the CSS file for styling

const App = () => {
    // Local state for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handlers for input changes
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Function to handle sign in
    const handleSignIn = async (e) => {
        e.preventDefault();
        const {email, password} = formData;
        const loginResponse = await fetch('http://localhost:8080/api/login', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });
        window.location.href = '/dashboard';
    };

    // Function to redirect to the register page
    const handleRegister = () => {
        window.location.href = '/register';
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="button" onClick={handleSignIn}>
                        Sign in
                    </button>
                    <button
                        type="button"
                        className="register-btn"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default App;
