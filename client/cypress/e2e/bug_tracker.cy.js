describe('Bug Tracker E2E Tests', () => {
  beforeEach(() => {
    // Start from the home page for each test
    cy.visit('http://localhost:3000');
    
    // Mock API responses
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: {
        bugs: [
          {
            _id: '1',
            title: 'Login button not working',
            description: 'The login button does nothing when clicked',
            status: 'open',
            priority: 'high',
            reporter: 'John Doe',
            createdAt: '2023-10-01T00:00:00.000Z'
          },
          {
            _id: '2',
            title: 'Dashboard loading slowly',
            description: 'Dashboard takes more than 5 seconds to load',
            status: 'in-progress',
            priority: 'medium',
            reporter: 'Jane Smith',
            createdAt: '2023-10-02T00:00:00.000Z'
          }
        ],
        total: 2
      }
    }).as('getBugs');
  });

  it('should load the application and display bugs', () => {
    cy.contains('🐛 MERN Bug Tracker').should('be.visible');
    cy.contains('Track and manage software bugs effectively').should('be.visible');
    
    cy.wait('@getBugs');
    
    cy.contains('Login button not working').should('be.visible');
    cy.contains('Dashboard loading slowly').should('be.visible');
  });

  it('should report a new bug', () => {
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: {
        _id: '3',
        title: 'New E2E Test Bug',
        description: 'This bug was created via E2E test',
        status: 'open',
        priority: 'critical',
        reporter: 'E2E Tester',
        createdAt: new Date().toISOString()
      }
    }).as('createBug');

    cy.contains('Report New Bug').click();
    
    cy.get('form').within(() => {
      cy.get('input[name="title"]').type('New E2E Test Bug');
      cy.get('textarea[name="description"]').type('This bug was created via E2E test');
      cy.get('input[name="reporter"]').type('E2E Tester');
      cy.get('select[name="priority"]').select('critical');
      
      cy.contains('Report Bug').click();
    });

    cy.wait('@createBug').then((interception) => {
      expect(interception.request.body).to.include({
        title: 'New E2E Test Bug',
        description: 'This bug was created via E2E test',
        reporter: 'E2E Tester',
        priority: 'critical'
      });
    });
  });

  it('should search for bugs', () => {
    cy.intercept('GET', '/api/bugs/search?q=login', {
      statusCode: 200,
      body: [
        {
          _id: '1',
          title: 'Login button not working',
          description: 'The login button does nothing when clicked',
          status: 'open',
          priority: 'high',
          reporter: 'John Doe',
          createdAt: '2023-10-01T00:00:00.000Z'
        }
      ]
    }).as('searchBugs');

    cy.get('input[placeholder="Search bugs..."]').type('login');
    cy.contains('button', 'Search').click();
    
    cy.wait('@searchBugs');
    cy.contains('Login button not working').should('be.visible');
    cy.contains('Dashboard loading slowly').should('not.exist');
  });

  it('should filter bugs by status', () => {
    cy.intercept('GET', '/api/bugs?status=open', {
      statusCode: 200,
      body: {
        bugs: [
          {
            _id: '1',
            title: 'Login button not working',
            description: 'The login button does nothing when clicked',
            status: 'open',
            priority: 'high',
            reporter: 'John Doe',
            createdAt: '2023-10-01T00:00:00.000Z'
          }
        ],
        total: 1
      }
    }).as('filterBugs');

    cy.get('select[data-testid="status-filter"]').select('open');
    
    cy.wait('@filterBugs');
    cy.contains('Login button not working').should('be.visible');
    cy.contains('Dashboard loading slowly').should('not.exist');
  });

  it('should update bug status', () => {
    cy.intercept('PUT', '/api/bugs/1', {
      statusCode: 200,
      body: {
        _id: '1',
        title: 'Login button not working',
        description: 'The login button does nothing when clicked',
        status: 'in-progress',
        priority: 'high',
        reporter: 'John Doe',
        createdAt: '2023-10-01T00:00:00.000Z'
      }
    }).as('updateBug');

    cy.contains('Login button not working')
      .parents('[data-testid="bug-card"]')
      .within(() => {
        cy.get('select[data-testid="status-select"]').select('in-progress');
      });

    cy.wait('@updateBug').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        status: 'in-progress'
      });
    });
  });

  it('should delete a bug', () => {
    cy.intercept('DELETE', '/api/bugs/2', {
      statusCode: 200,
      body: { message: 'Bug deleted successfully' }
    }).as('deleteBug');

    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: {
        bugs: [
          {
            _id: '1',
            title: 'Login button not working',
            description: 'The login button does nothing when clicked',
            status: 'open',
            priority: 'high',
            reporter: 'John Doe',
            createdAt: '2023-10-01T00:00:00.000Z'
          }
        ],
        total: 1
      }
    }).as('getBugsAfterDelete');

    cy.contains('Dashboard loading slowly')
      .parents('[data-testid="bug-card"]')
      .within(() => {
        cy.get('[data-testid="delete-button"]').click();
      });

    cy.on('window:confirm', () => true);
    
    cy.wait('@deleteBug');
    cy.contains('Dashboard loading slowly').should('not.exist');
  });

  it('should display error when API fails', () => {
    cy.intercept('GET', '/api/bugs', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getBugsError');

    cy.visit('http://localhost:3000');
    
    cy.wait('@getBugsError');
    cy.contains('Failed to fetch bugs').should('be.visible');
  });
});