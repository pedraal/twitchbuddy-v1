/* global cy */

function fillStandardSearch () {
  cy.get('input[name="channel"]').click().type('zerator')
  cy.get('.v-select').contains('Hebdomadaire').click()
  cy.contains('Tout').click()
  cy.contains('Rechercher').click()
}

describe('The clip tool', () => {
  it('successfully loads', () => {
    cy.visit('/clips')
  })

  it('can search clips from a channel', () => {
    cy.visit('/clips')
    fillStandardSearch()
    cy.get('.v-expansion-panels').children().first().click()
  })

  it('displays error if searched channel does not exists or has no clips', () => {
    cy.visit('/clips')
    cy.get('input[name="channel"]').click().type('Th3r3IsN0Ch4nc3Th1sCh4nnel3xists')
    cy.contains('Rechercher').click()
    cy.get('.v-input--has-state.error--text')
  })

  it('can be scrolled down to load more', () => {
    cy.visit('/clips')
    fillStandardSearch()
    cy.get('.v-expansion-panels').children().last().scrollIntoView({ easing: 'linear' })
    cy.get('.v-expansion-panel:nth-of-type(100)').scrollIntoView({ easing: 'linear' })
    cy.get('.v-expansion-panels').children()
  })

  it('can search clips on a custom timerange', () => {
    cy.visit('/clips')
    cy.get('input[name="channel"]').click().type('zerator')
    cy.get('.v-select__selections').click()
    cy.get('.v-list-item').contains('Personnalisé').click()
    cy.get(':nth-child(3) > .v-input input').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('table:last-of-type tbody > :nth-child(2) > :nth-child(1) > .v-btn').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('.v-date-picker-header > :nth-child(1) > .v-btn__content > .v-icon').click()
    cy.get('table:last-of-type tbody > :nth-child(2) > :nth-child(7) > .v-btn').click()
    cy.get('.v-picker__actions > :nth-child(3) > .v-btn__content').click()
    cy.contains('Rechercher').click()
    cy.get('.v-expansion-panel')
  })

  it('can download clip from a search', () => {
    cy.visit('/clips')
    fillStandardSearch()
    cy.get('.v-expansion-panels').children().first().click()
    cy.get('.v-expansion-panel').contains('Télécharger').then((el) => {
      expect(el[0].href).to.match(/https:\/\/clips-media-assets2\.twitch\.tv\S+.mp4/)
    })
  })
})
