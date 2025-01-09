describe('Login and Register Page Tests', () => {
  const baseUrl = 'http://localhost:5173'; // Replace with your application's URL
  const user = 'testuser';
  const email = 'testuser@example.com';
  const password = 'testingthisuser19364513!';

  it('Should successfully register a new user', () => {
      cy.visit(`${baseUrl}/register`); // Navigate to the register page

      // Fill in registration form
      cy.get('#username').type(user);
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('#confirm-password').type(password);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Check for successful registration message
      cy.on('window:alert', (text) => {
        expect(text).to.equal(`testuser registered successfully. An email has been sent to your email for verification.`);
    });; 
  });

  it('Should successfully log in with valid credentials', () => {
    cy.visit(`${baseUrl}/`); // Navigate to the login page
    
    // Fill in login form
    cy.get('#email').type(email);
    cy.get('#password').type(password);

    // Submit the form
    cy.contains('Sign in').click();

    // Check for successful login (e.g., redirection or specific element)
    cy.url().should('include', '/guacamole'); 
});
});



