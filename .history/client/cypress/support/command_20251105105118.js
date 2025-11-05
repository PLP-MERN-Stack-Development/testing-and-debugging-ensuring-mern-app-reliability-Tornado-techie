// Custom Cypress commands
Cypress.Commands.add('createBug', (bugData) => {
  cy.request('POST', '/api/bugs', bugData);
});

Cypress.Commands.add('deleteAllBugs', () => {
  cy.request('GET', '/api/bugs').then((response) => {
    const bugs = response.body.bugs;
    bugs.forEach(bug => {
      cy.request('DELETE', `/api/bugs/${bug._id}`);
    });
  });
});

Cypress.Commands.add('login', (username, password) => {
  // Custom login command if you add authentication later
  cy.session([username, password], () => {
    cy.request('POST', '/api/login', { username, password })
      .its('body')
      .then((body) => {
        window.localStorage.setItem('authToken', body.token);
      });
  });
});