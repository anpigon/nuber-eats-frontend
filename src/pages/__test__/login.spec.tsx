import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

import Login, { LOGIN_MUTATION } from "../login";
import userEvent from "@testing-library/user-event";
import { render, waitFor, RenderResult } from "../../test-utils";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    mockedClient = createMockClient();
    await waitFor(() => {
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, "this@wont");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email is required/i);
  });

  it("display password required errors", async () => {
    const { getByPlaceholderText, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    await waitFor(() => {
      userEvent.type(email, "this@wont.com");
      userEvent.type(password, "1");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(
      /Password must be more than 6 chars./i
    );

    await waitFor(() => {
      userEvent.clear(password);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required/i);
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole(/button/i);
    expect(submitBtn).toContainHTML("Log in");

    const formData = {
      email: "real@test.com",
      password: "111111",
    };

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toBeCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: formData,
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");
  });
});
