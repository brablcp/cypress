before(()=> {
  cy.navigateToWeb('https://aukro.cz/', 'aukro')
}) 

describe("Aukro Suit", () =>{

  const offersOnPage = length;

  it("Category Navigation and Filtering", ()=>{

      // Navigate to category -> "Sberatelstvi"
      cy.navigateToCategory("sberatelstvi", "sberatelstvi")
      
      // Filter by Offer paraments -> Select "Money back guarantee" - index 1
      cy.filetringByOfferParameters("1")

      // Count all the offers on the page
      cy.countOffersOnPage()
      
      // Check the "Money back guarantee" label for each element
      cy.checkOfferParamName("money-back-guarantee")

      // Navigate to Offer Detail page
      if(offersOnPage % 2 == 0) {
          cy.xpath("//auk-list-view/auk-list-card//img").anyElement().click()
      }
      else{
          var offerNumber = Math.round(offersOnPage % 2)
          cy.xpath(`(//auk-list-view/auk-list-card//img)[${offerNumber}]`).click()
      }
      cy.xpath("//auk-item-detail-current-media/ancestor::div[contains(@class,'grid')]").should("be.visible", {timeout:20000})

      // Check Offer`s Details
      cy.get(" auk-item-detail-shipping-box a[class*='pointer']").click()
      cy.xpath("(//a[contains(@href,'garance')]//ancestor::span/auk-icon)[1]").should("be.visible", {timeout: 5000})
      
      // Performe Buy Now or Auction flow
      cy.scrollTo("top",{ duration: 2000 })

      cy.get('auk-countdown-panel').then($body =>{
          if($body.text().includes(" Kup teď ")){
              cy.buyNow()
          }
          else if($body.text().includes(" Aukce ")){
              cy.auction()
          }
      })
  })
});