import { render, screen, fireEvent } from "@testing-library/react";
import Explore from "./explore";
import { BrowserRouter } from "react-router-dom";
import ax from "../../conf/ax";

jest.mock("../../conf/ax", () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

describe("Explore Component", () => {
  test("ควรมีช่อง input สำหรับค้นหาคอร์ส", () => {
    render(
      <BrowserRouter>
        <Explore />
      </BrowserRouter>
    );

    // ตรวจสอบว่ามี input box หรือไม่
    const inputElement = screen.getByPlaceholderText("Search courses...");
    expect(inputElement).toBeInTheDocument();
  });

  test("ควรอัปเดตค่า query เมื่อผู้ใช้พิมพ์", () => {
    render(
      <BrowserRouter>
        <Explore />
      </BrowserRouter>
    );

    const inputElement = screen.getByPlaceholderText("Search courses...");
    fireEvent.change(inputElement, { target: { value: "React" } });
    expect(inputElement.value).toBe("React");
  });
});
