import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { AuthContext } from "../../context/Auth.context";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSetState } from "react-use";
import ax from "../../conf/ax";

jest.mock("../../conf/ax", () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("react-use", () => ({
  useSetState: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();
  const mockSetState = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    toast.error.mockClear();
    toast.success.mockClear();
    mockLogin.mockClear();
    useSetState.mockReturnValue([{ username: "", password: "" }, mockSetState]);
  });

  const renderLoginWithContext = (state) => {
    return render(
      <AuthContext.Provider value={state}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it("renders the form correctly", () => {
    renderLoginWithContext({
      state: { isLoginPending: false, isLoggedIn: false, loginError: null },
      login: mockLogin,
    });

    expect(screen.getByText("ยินดีต้อนรับสู่ TECHSPHERE")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("กรุณาใส่ชื่อผู้ใช้งาน")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("กรุณาใส่รหัสผ่าน")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /เข้าสู่ระบบ/i })
    ).toBeInTheDocument();
  });

  it("displays error toast on login error", () => {
    renderLoginWithContext({
      state: {
        isLoginPending: false,
        isLoggedIn: false,
        loginError: "Login failed",
      },
      login: mockLogin,
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Login failed",
      expect.any(Object)
    );
  });

  it("displays success toast on successful login", () => {
    renderLoginWithContext({
      state: { isLoginPending: false, isLoggedIn: true, loginError: null },
      login: mockLogin,
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Welcome. Login Successfully",
      expect.any(Object)
    );
  });

  it("displays pending message while logging in", () => {
    renderLoginWithContext({
      state: { isLoginPending: true, isLoggedIn: false, loginError: null },
      login: mockLogin,
    });

    expect(screen.getByText("กำลังรอการล็อกอิน...")).toBeInTheDocument();
  });

  it("displays error message when username or password is empty", () => {
    renderLoginWithContext({
      state: { isLoginPending: false, isLoggedIn: false, loginError: null },
      login: mockLogin,
    });

    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter both username and password.",
      expect.any(Object)
    );
  });
});
