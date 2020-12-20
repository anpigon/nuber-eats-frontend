describe("Create Account", () => {
  const user = cy;

  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.get("[name=email]").type("non@good");
    user.get("[role=alert]").should("have.text", "Please enter a valid email");

    user.get("[name=email]").clear();
    user.get("[role=alert]").should("have.text", "Email is required");
    user.get("[name=email]").type("real@mail.com");
    user.get("[name=password]").type("a").clear();
    user.get("[role=alert]").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    user.get("[name=email]").clear().type("test@gmail.com");
    user.get("[name=password]").type("111111");
    user.get("button").click();

    user.wait(1000);
    user.title().should("eq", "Login | Nuber Eats");
    user.login("test@gmail.com", "111111");
  });
});
