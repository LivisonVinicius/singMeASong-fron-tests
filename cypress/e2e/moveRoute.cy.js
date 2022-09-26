describe("moveRouter", () => {
  it("moves from home to top address", () => {
    cy.visit("http://localhost:3000");
    cy.contains("top").click()
    cy.url().should.("equal", "")
  });
});
