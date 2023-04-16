// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Navigate to Web
Cypress.Commands.add('navigateToWeb', (url, checkWord) => {
    // Navigate to Aukro web
    cy.visit(url, {timeout:20000})
    cy.viewport(1440, 900)

    // Assert if reached URL contains aukro
    cy.url().should("contain", checkWord)

    // Verify and close (by accepting the coockie) Coockies popup
    cy.get("#didomi-notice-agree-button").then($button =>{
        if($button.is(':visible')){
            cy.get($button).click()
        }
    })
    
    // Close newslatter popup
    if(Cypress.$("#mat-dialog-0").length){
        cy.xpath("//header[contains(@class,'star')]//i[text()='close']").click()
    }
})

// Navigate to a different categories 
Cypress.Commands.add('navigateToCategory', (categoryName, checkWord) => {
 
    cy.get(`[class*='main'][class*='link'] [href='/${categoryName}']`).click()
    cy.get(".product-sorting").should("be.visible", {timeout: 20000})
    cy.url().should("contain", checkWord)
})

// Filter by Offer parameters
Cypress.Commands.add('filetringByOfferParameters', (offerIndex) => {
    // Scroll to Filtering section
    cy.xpath(`(//auk-simple-filter-checkbox//mat-checkbox[contains(@id,'checkbox')])[${offerIndex}]`).scrollIntoView()
    // Select checkbox
    cy.xpath(`(//auk-simple-filter-checkbox//mat-checkbox[contains(@id,'checkbox')])[${offerIndex}]`).click()
    // Assert the checkbox is checked
    cy.xpath(`(//auk-simple-filter-checkbox//mat-checkbox[contains(@id,'checkbox') and contains(@class, 'checked')])[${offerIndex}]`).should("be.visible")
})

// Count Offers on Page 
Cypress.Commands.add('countOffersOnPage', () => {

    cy.xpath("//auk-list-view/auk-list-card").then(($value) => {
        length = $value.length
        cy.log("Length is" + length)
        //return length
    })
})

// Verify the filtering was applied by checking the Offer Parameter name
Cypress.Commands.add('checkOfferParamName', (offerParameterName) => {
    for (let i=1; i<length; i++){

        cy.xpath(`(//auk-list-card)[${i}]//auk-svg-icon-legacy[contains(@id,'${offerParameterName}') and contains(@class,'middle')]`).should("be.visible")
    }
})

// Click on any element from the list
Cypress.Commands.add('anyElement', { prevSubject: 'element' }, (subject, size = 1) => {
    cy.wrap(subject).then(elementList => {
      elementList = (elementList.jquery) ? elementList.get() : elementList;
      elementList = Cypress._.sampleSize(elementList, size);
      elementList = (elementList.length > 1) ? elementList : elementList[0];
      cy.wrap(elementList);
    });
  });

// "Buy Now" flow
Cypress.Commands.add('buyNow', () =>{
    cy.xpath("//div[text()=' Kup teď ']").should("be.visible")
    cy.xpath("//div[text()='Koupit']").click()
    cy.get("auk-basket-control span[data-count]").invoke("data-count").should("eq", 1)
});

// "Auction" flow
Cypress.Commands.add('auction', () =>{
    cy.xpath("//div[text()=' Aukce ']").should("be.visible")
    // Get the number form string (actual price)
    cy.get("auk-item-detail-main-item-panel-price span[class*='bold']").then(($priceHolder) => {
        const price = $priceHolder.text().match(/[0-9 ]+/)[0].replace(/\s+/g, '').trim()
        cy.log(price)

        // Calculate and increase auction price up to 20%
        const betAmount = Math.round(price * 1.2)
        cy.log(betAmount)

        // Input and add auction
        cy.get("auk-item-detail-main-item-panel input").click()
        cy.get("auk-item-detail-main-item-panel input").type(betAmount)
    })

    // Click on add button and verify login dialog is open
    cy.xpath("//div[text()='Přihodit']//ancestor::button").should('not.be.disabled', {timeout: 10000})
    cy.xpath("//div[text()='Přihodit']").click()
    cy.get("[class*='dialog-container']").should("be.visible", {timeout: 10000})
})