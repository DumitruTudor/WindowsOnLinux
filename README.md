# Windows Application Service

## Overview

This project is a web-based service where users can create an account, log in, and choose from a selection of Windows applications to use remotely. After selecting an application, the user is provided access to a dedicated EC2 instance where they can freely interact with the selected application.

## Features

- **User Registration & Login**: 
  Users can sign up with an email, username, and password. Once registered, they can log in to their account securely.
  
- **Application Selection**: 
  After logging in, users are presented with a dashboard where they can choose from a list of Windows applications, including:
  - Word
  - PowerPoint
  - Excel
  - Access

- **EC2 Integration**: 
  Once a user selects an application, they are connected to a remote EC2 instance that is pre-configured with the selected Windows application, allowing them to use the software as if it were installed locally on their device.

## How It Works

1. **User Registration**: 
   Users sign up by providing their email, username, and password. Once registered, users can log in to their account.
   
2. **Login**: 
   After successful login, the user is redirected to a dashboard page that lists the available Windows applications.

3. **Application Selection**: 
   From the dashboard, the user selects the application they wish to use. Upon selection, the system provisions an EC2 instance (or connects to an existing one) that has the chosen application installed.

4. **Remote Access to EC2 Instance**: 
   The user is seamlessly logged into a remote Windows EC2 instance where they can access the application they selected, allowing them to work as if the application were installed on their local machine.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (for user accounts and session management)
- **Cloud Infrastructure**: AWS EC2 (for hosting Windows instances and providing application access)
- **Authentication**: JSON Web Tokens (JWT) or similar authentication mechanism

