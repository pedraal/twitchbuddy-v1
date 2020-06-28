/* global cy */

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })

  it('has google analytics consent handling attached', () => {
    cy.get('p').should('contain', 'Ce site utilise les cookies')
    cy.contains('Accepter').click()
    cy.getCookie('hasConsent', 'true').should('exist')
    cy.getCookie('_ga').should('exist')
    cy.getCookie('_gid').should('exist')
  })
})
