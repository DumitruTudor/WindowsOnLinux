describe('Login and Register Page Tests', () => {
  const baseUrl = 'http://localhost:5173'; // Replace with your application's URL

  it('Should successfully log in with valid credentials', () => {
      cy.visit(`${baseUrl}/`); // Navigate to the login page

      // Fill in login form
      cy.get('#email').type('chris@yahoo.com');
      cy.get('#password').type('Smokeweed13!');

      // Submit the form
      cy.contains('Sign in').click();

      // Check for successful login (e.g., redirection or specific element)
      cy.url().should('include', '/guacamole'); // Replace with the actual route
  });

  it('Should successfully register a new user', () => {
      cy.visit(`${baseUrl}/register`); // Navigate to the register page

      // Fill in registration form
      cy.get('#username').type('testuser');
      cy.get('#email').type('testuser@example.com');
      cy.get('#password').type('testingthisuser19364513!');
      cy.get('#confirm-password').type('testingthisuser19364513!');

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Check for successful registration message
      cy.on('window:alert', (text) => {
        expect(text).to.equal(`testuser registered successfully. An email has been sent to your email for verification.`);
    });; // Replace with a suitable success message
  });
});
