import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { render, waitFor, RenderResult } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/globalTypes";

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Nuber Eats")
    );
  });

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole(/button/i);

    await waitFor(() => {
      userEvent.type(email, "wont@work");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email is required/i);

    await waitFor(() => {
      userEvent.type(email, "wont@work.com");
      userEvent.click(submitBtn);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required/i);
  });

  it("submits mutation with form values", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole(/button/i);
    const formData = {
      email: "working@mail.com",
      password: "111111",
      role: UserRole.Client,
    };

    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });

    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateAccountMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith({
      createAccountInput: formData,
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    const mutationError = getByRole("alert");
    expect(mutationError).toHaveTextContent("mutation-error");
  });
});
