beforeEach(async () => {
  await cy.resetDatabase();
});

describe("moveRouter", () => {
  it("moves from home to top address", () => {
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.wait("@getLike");
    cy.contains("Top").click();
    cy.url().should("equal", "http://localhost:3000/top");
  });
  it("moves from home and got to random without a recommendation", () => {
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.wait("@getLike");
    cy.contains("Random").click();
    cy.url().should("equal", "http://localhost:3000/random");
    cy.contains("Loading").should("be.visible");
  });
  // it("create recommendation ")
});
