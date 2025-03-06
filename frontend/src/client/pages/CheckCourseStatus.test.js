"นายปฐมพงศ์ ศิริสวัสดิ์ 6710110239"

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import CheckCourseStatus from "./CheckCourseStatus";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";

jest.mock("../../conf/ax", () => ({
    get: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

describe("ตรวจสอบองค์ประกอบของหน้า CheckCourseStatus.js", () => {
    const mockUser = {
        id: "1",
        first_name: "Jimmy",
        last_name: "Ymmij",
        email: "jimmy.ymmij@example.com",
    };

    const mockCourses = [
        {
            id: "1",
            status_confirm: "confirmed",
            course_purchase: [{ Name: "Write Python code until your dad approves" }],
            amount: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            id: "2",
            status_confirm: "waiting",
            course_purchase: [{ Name: "How to Fix (ERROR) 401, 402, 403, and Other Numbers You Don't Like" }],
            amount: 800,
            createdAt: new Date().toISOString(),
        },
        {
            id: "3",
            status_confirm: "unapproved",
            course_purchase: [{ Name: "How to Become Hacker" }],
            amount: 1500,
            createdAt: new Date().toISOString(),
        },
    ];

    const renderComponent = () => {
        return render(
            <Router>
                <AuthContext.Provider value={{ state: { user: mockUser } }}>
                    <CheckCourseStatus />
                </AuthContext.Provider>
            </Router>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        ax.get.mockResolvedValue({
            data: { data: mockCourses },
        });
    });

    test("ตรวจสอบการ render หน้านี้", async () => {
        renderComponent();

        await waitFor(() => {
            const headers = screen.getAllByText(/ข้อมูลสถานะการซื้อคอร์ส/i);
            expect(headers[0]).toBeInTheDocument();
        });
    });


    test("ตรวจสอบจำนวนคำสั่งซื้อว่าดึงมาครบ", async () => {
        renderComponent();

        await waitFor(() => {
            const courseElements = screen.getAllByText(/ชื่อคอร์ส:/i);
            expect(courseElements.length).toBe(mockCourses.length);
        });
    });

    test("ตรวจสอบการพิมพ์ค้นหา", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Write Python code until your dad approves/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/พิมพ์ชื่อคอร์สที่ต้องการค้นหา/i), {
            target: { value: "dad" },
        });

        expect(screen.queryByText(/How to Become Hacker/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Write Python code until your dad approves/i)).toBeInTheDocument();
    });

    test("ตรวจสอบว่าถ้ามีคอร์สที่ 'ไม่อนุมัติ' จะมี pop up ขึ้นเตือนหรือไม่", async () => {
        renderComponent();

        await waitFor(() => {
            expect(
                screen.findByText(/ตอนนี้มีคอร์สของคุณที่ไม่ได้รับการอนุมัติ/i)
            ).resolves.toBeInTheDocument();
        });
    });

});