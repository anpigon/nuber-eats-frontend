describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can fill out the form", () => {
    cy.visit("/")
      .get("[name=email")
      .type("nico@nomadcoders.co")
      .get("[name=password")
      .type("123456")
      .get("button")
      .should("not.have.class", "pointer-events-none");
  });

  it("can see email / password validation errors", () => {
    cy.visit("/")
      .get("[name=email")
      .type("bad@email")
      .get("[role=alert]")
      .should("have.text", "Please enter a valid email");
  });
});
