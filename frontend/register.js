import { IAMClient, CreateUserCommand } from "@aws-sdk/client-iam";

//create IAM user
const iamClient = new IAMClient();
const userName = "";

const createIAMUser = async () => {
    try {
        const data = await iamClient.send(new CreateUserCommand({ UserName: userName }));
        console.log("Success", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the value of the username field
        userName = document.getElementById('username').value;

        // You can now use the username variable in JavaScript
        console.log('Username:', userName);

        // You can add more logic here, like sending the username to a server
        alert('Username submitted: ' + userName);
    });
    createIAMUser();
});
