import React, { useState } from "react";
import setupGuacamoleRDPConnection from "../../backend/guacamole/guacamoleRdp.js";
import uploadObj  from "../../backend/aws/s3.js";
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
    console.log("User data:", userData)
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
            await setupGuacamoleRDPConnection(
            {
                adminUsername: "guacadmin",
                adminPassword: "Scorpion19364513!",
                connectionName: `${username}-Windows`,
                hostname: "35.176.33.93",
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
    const generatePowerShellScript = (username) =>
    {
        const script = `
        # Define the user and desktop path
        $UserName = "${username}"
        $DesktopPath = "C:\\Users\\$UserName\\Desktop"

        # Check if the Desktop folder exists for the user
        if (!(Test-Path -Path $DesktopPath)) {
            Write-Output "Desktop path for user $UserName not found."
            exit 1
        }

        # Define shortcuts to create
        $Shortcuts = @(
            @{ Name = "Microsoft Word"; TargetPath = "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE"; IconLocation = "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE" },
            @{ Name = "Microsoft Excel"; TargetPath = "C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE"; IconLocation = "C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE" },
            @{ Name = "Microsoft PowerPoint"; TargetPath = "C:\\Program Files\\Microsoft Office\\root\\Office16\\POWERPNT.EXE"; IconLocation = "C:\\Program Files\\Microsoft Office\\root\\Office16\\POWERPNT.EXE" }
        )

        # Create the shortcuts
        foreach ($Shortcut in $Shortcuts) {
            $ShortcutPath = Join-Path -Path $DesktopPath -ChildPath ("$($Shortcut.Name).lnk")
            $WScriptShell = New-Object -ComObject WScript.Shell
            $ShortcutObject = $WScriptShell.CreateShortcut($ShortcutPath)
            $ShortcutObject.TargetPath = $Shortcut.TargetPath
            $ShortcutObject.IconLocation = $Shortcut.IconLocation
            $ShortcutObject.Save()
            Write-Output "Shortcut created: $($Shortcut.Name)"
        }
        `;
        return script;
    };
    const scriptContent = generatePowerShellScript(userData.username);
    const bucketName = "windows-scripts";
    const fileKey = `${userData.username}-Windows`;
    uploadObj(bucketName, fileKey, scriptContent);
    const response = await fetch ("http://localhost:3000/api/run-ssm",
        {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                instanceId: import.meta.env.VITE_AWS_INSTANCE_ID,
                bucketName,
                fileKey
            })
        }
    )
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
