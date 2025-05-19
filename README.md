# WinOnCloud

## Overview

This project is a web-based service where users can create an account, log in, and choose from a selection of Windows applications to use remotely. Rhe user is provided access to a dedicated EC2 instance where they can freely interact with the operating system and the installed application directly in the web browser window.

## Features

- **User Registration & Login**:
  Users can sign up with an email, username, and password. Once registered, they can log in to their account securely.

- **Application Selection**:
  After logging in, users are presented with a functional Windows Virtual Machine where they can choose from a list of Windows applications on the desktop, including:
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
   After successful login, the user is redirected to a Guacamole connection page that performs the RDP connection to the EC2 machine

3. **Remote Access to EC2 Instance**:
   The user is seamlessly logged into a remote Windows EC2 instance where they can access any application available on the desktop, allowing them to work as if the application were installed on their local machine.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, JavaScript
- **Database**: MongoDB (for user accounts and session management)
- **Cloud Infrastructure**: AWS EC2 (for hosting Windows instances and providing application access)
- **RDP Connection**: Apache Guacamole is the current system used to establish the RDP connection to the EC2 instance. (TO BE CHANGED)
- **Authentication**: JSON Web Tokens (JWT)
