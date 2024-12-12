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
        try
        {
            //login validation logic
            const loginResponse = await fetch('http://localhost:5050/api/login', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            if(loginResponse.ok)
            {
                const loginResult = await loginResponse.json();
                alert('Login successful');
                // store JWT Token in localStorage
                localStorage.setItem('token', loginResult.token);
                window.location.href = '/dashboard';
            }
            else
            {
                const errorData = await loginResponse.json();
                alert(`Error: ${errorData.message}`);
            }
        }
        catch(error)
        {
            console.error('Error:', error);
            alert('An error occurred during login: ' + error.message);
            return;
        }        
        
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
