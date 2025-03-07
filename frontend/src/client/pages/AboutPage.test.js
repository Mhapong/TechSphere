import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/Auth.context";
import AboutPage from "./About";
import ax from "../../conf/ax";

// Mock API call
jest.mock("../../conf/ax", () => ({
  get: jest.fn(),
}));

describe("AboutPage Component", () => {
  const mockUser = { first_name: "John", last_name: "Doe", role: { type: "lecturer" } };

  const renderComponent = (user = null) => {
    return render(
      <AuthContext.Provider value={{ state: { user } }}>
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test("renders AboutPage correctly", () => {
    renderComponent();
    expect(screen.getByText("ศูนย์กลางการเรียนรู้ด้านเทคโนโลยี")).toBeInTheDocument();
    expect(screen.getByText("TechSphere")).toBeInTheDocument();
  });

  test("fetches and displays lecturers", async () => {
    ax.get.mockResolvedValueOnce({
      data: [mockUser],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });


  test("displays 'ไม่พบข้อมูลอาจารย์' when no lecturers found", async () => {
    ax.get.mockResolvedValueOnce({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("ไม่พบข้อมูลอาจารย์")).toBeInTheDocument();
    });
  });

  test("shows login/register buttons when user is not authenticated", () => {
    renderComponent();
    expect(screen.getByText("เข้าสู่ระบบ")).toBeInTheDocument();
    expect(screen.getByText("ลงทะเบียน")).toBeInTheDocument();
  });

  test("does not show login/register buttons when user is authenticated", () => {
    renderComponent(mockUser);
    expect(screen.queryByText("เข้าสู่ระบบ")).not.toBeInTheDocument();
    expect(screen.queryByText("ลงทะเบียน")).not.toBeInTheDocument();
  });
});
