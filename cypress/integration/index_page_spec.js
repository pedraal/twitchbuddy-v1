/* global cy */

describe('The home page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })

  it('has french texts', () => {
    cy.contains('Accélerez votre recherche de clips et regardez plusieurs replays de différentes chaines synchronisés.')
  })
})
