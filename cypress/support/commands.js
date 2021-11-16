
Cypress.Commands.add('login',(email, password)  => {

    cy.visit("www.baseURL.com"); // Assuming www.baseURL.com is the baseurl

    cy.get('[data-test-id="email"]').type(email) // Assuming data-test-id is email for email field
    cy.get('[data-test-id="password"]').type(password) // Assuming data-test-id is password for password field
    cy.get('[data-test-id="submit"]').click() // Assuming data-test-id is submit for login button
    
    cy.location().should('include', '/Dashboard') // Assuming Dashboard is the home page after login successful

    return cy
  });

  