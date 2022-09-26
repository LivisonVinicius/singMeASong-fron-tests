import { faker } from "@faker-js/faker";

beforeEach(async () => {
  await cy.resetDatabase();
});

describe("createRecommendation", () => {
  it("creates a recommendation", () => {
    const Name = faker.lorem.word();
    const link = faker.lorem.word();
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.get("input[data-cy=NameInput]").type(Name);
    cy.get("input[data-cy=LinkInput]").type(`https://www.youtube.com/${link}`);
    cy.get("button[data-cy=CreateButton]").click();
    cy.wait("@getLike");
    cy.contains(`${Name}`).should("be.visible");
  });
  it("try to create same recommendation", () => {
    const Name = faker.lorem.word();
    const link = faker.lorem.word();
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.get("input[data-cy=NameInput]").type(Name);
    cy.get("input[data-cy=LinkInput]").type(`https://www.youtube.com/${link}`);
    cy.get("button[data-cy=CreateButton]").click();
    cy.wait("@getLike");
    cy.get("input[data-cy=NameInput]").type(Name);
    cy.get("input[data-cy=LinkInput]").type(`https://www.youtube.com/${link}`);
    cy.get("button[data-cy=CreateButton]").click();
    cy.on("window:alert", (t) => {
      expect(t).to.contains("Error creating recommendation!");
    });
  });

  it("likes a recommendation", () => {
    cy.visit("http://localhost:3000");
    const Name = faker.lorem.word();
    const link = faker.lorem.word();
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.get("input[data-cy=NameInput]").type(Name);
    cy.get("input[data-cy=LinkInput]").type(`https://www.youtube.com/${link}`);
    cy.get("button[data-cy=CreateButton]").click();
    cy.wait("@getLike");
    cy.intercept("POST", "/recommendations/**").as("Like");
    cy.get("svg[data-cy=LikeButton]").first().click();
    cy.wait("@Like");
    cy.wait("@getLike");
    cy.get("div[data-cy=LikeContainer]").first().should("have.text", 1);
  });
  it("unlikes a recommendation", () => {
    const Name = faker.lorem.word();
    const link = faker.lorem.word();
    cy.visit("http://localhost:3000");
    cy.intercept("POST", "/recommendations/**").as("unLike");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.get("input[data-cy=NameInput]").type(Name);
    cy.get("input[data-cy=LinkInput]").type(`https://www.youtube.com/${link}`);
    cy.get("button[data-cy=CreateButton]").click();
    cy.wait("@getLike");
    cy.get("svg[data-cy=unLikeButton]").first().click();
    cy.wait("@unLike");
    cy.wait("@getLike");
    cy.get("div[data-cy=LikeContainer]").first().should("have.text", -1);
  });
  it("if a post gets -6 gets deleted", () => {
    const Name = faker.animal.cat();
    const link = faker.lorem.word();
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.intercept("POST", "/recommendations/**").as("unLike");
    cy.get("input[data-cy=NameInput]").type(Name);
    cy.get("input[data-cy=LinkInput]").type(`https://www.youtube.com/${link}`);
    cy.get("button[data-cy=CreateButton]").click();
    cy.wait("@getLike");
    for (let i = 0; i < 6; i++) {
      cy.get("svg[data-cy=unLikeButton]").first().click();
      cy.wait("@unLike");
    }
    cy.get("div[data-cy=LikeContainer]").first().should("have.text", -5);
    cy.contains("name").should("not.exist");
  });
  it("user do not type valid inputs", () => {
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("getLike");
    cy.get("button[data-cy=CreateButton]").click();
    cy.on("window:alert", (t) => {
      expect(t).to.contains("Error creating recommendation!");
    });
  });
});
