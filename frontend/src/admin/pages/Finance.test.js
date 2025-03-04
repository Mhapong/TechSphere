import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import FinanceOrder from "./Finance.js";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";

// Mock dependencies
jest.mock("../../conf/ax", () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

jest.mock("@mui/icons-material/Edit", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="edit-icon" />,
  };
});

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("FinanceOrder Component", () => {
  const mockUser = {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
  };

  const mockPayments = [
    {
      id: "1",
      amount: 1000,
      status_confirm: "waiting",
      users_purchase: {
        id: "2",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
      },
      course_purchase: [
        { id: "1", Name: "React Basics" },
        { id: "2", Name: "Advanced JavaScript" },
      ],
      createdAt: new Date().toISOString(),
      picture_purchase: { url: "/test-image.jpg" },
    },
    {
      id: "2",
      amount: 1500,
      status_confirm: "confirmed",
      users_purchase: {
        id: "3",
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@example.com",
      },
      course_purchase: [{ id: "3", Name: "Node.js Fundamentals" }],
      createdAt: new Date().toISOString(),
      picture_purchase: { url: "/another-image.jpg" },
    },
  ];

  const renderComponent = () => {
    return render(
      <Router>
        <AuthContext.Provider value={{ state: { user: mockUser } }}>
          <FinanceOrder />
        </AuthContext.Provider>
      </Router>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    ax.get.mockResolvedValue({
      data: { data: mockPayments },
    });
  });

  test("renders finance order page", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/มีคอร์สรอยืนยันของ TechSphere ทั้งหมด/i)
      ).toBeInTheDocument();
    });
  });

  test("displays correct number of payments", async () => {
    renderComponent();

    await waitFor(() => {
      const paymentElements = screen.getAllByText(/จำนวนเงินที่ต้องชำระ/i);
      expect(paymentElements.length).toBe(mockPayments.length);
    });
  });

  test("opens modal for payment verification", async () => {
    renderComponent();

    await waitFor(() => {
      const verifyButtons = screen.getAllByText(/ตรวจสอบการชำระ/i);
      expect(verifyButtons.length).toBeGreaterThan(0);
    });

    const verifyButton = screen.getByText(/ตรวจสอบการชำระ/i);
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText(/ยืนยันการชำระเงิน/i)).toBeInTheDocument();
    });
  });

  test("handles empty payment list", async () => {
    ax.get.mockResolvedValue({
      data: { data: [] },
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/ไม่พบข้อมูลการเงินที่ค้นหา/i)
      ).toBeInTheDocument();
    });
  });
});
