// Password complexity validation function (Windows 10 rules)
export function validatePassword(username, password)
{
    const lengthRequirement = /.{8,}/;
    const uppercaseRequirement = /[A-Z]/;
    const lowercaseRequirement = /[a-z]/;
    const numberRequirement = /\d/;
    const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/;

    // Check if password meets at least 3 out of 4 categories
    const validCategories = [
        uppercaseRequirement.test(password),
        lowercaseRequirement.test(password),
        numberRequirement.test(password),
        specialCharRequirement.test(password),
    ].filter(Boolean).length;
    
    //TODO check if the username exist in the password
    if (password.includes(username))
    {
        return false;
    }
    return lengthRequirement.test(password) && validCategories >= 3;
};
