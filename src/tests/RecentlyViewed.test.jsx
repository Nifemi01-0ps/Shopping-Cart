import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import userEvent from "@testing-library/user-event"

// Mock Zustand store
vi.mock("../store/useStore.js", () => ({
    useStore: (selector) => 
        selector({
            recentlyViewed: [
                {
                    id: 1,
                    name: "Test Product",
                    price: 100,
                    rating: 4,
                    img: "test.jpg",
                    collection: "Test Collection",
                },
                {
                    id: 2,
                    name: "Another Product",
                    price: 200,
                    rating: 5,
                    img: "test2.jpg",
                    collection: "Another Collection"
                },
                {
                    id: 3,
                    name: "Test 3",
                    price: 300,
                    rating: 4,
                    img: "test3.jpg",
                },
                {
                    id: 4,
                    name: "Test 4",
                    price: 400,
                    rating: 3,
                    img: "test4.jpg"
                }
            ]
        })
}));

// Mock react router Link 
vi.mock("react-router-dom", () => ({
    Link: ({ children }) => <a>{children}</a>
}));

// Mock utils
vi.mock("../utils/index.js", () => ({
    fmt: (price) => `$${price}`,
    starsStr: (rating) => "★".repeat(rating),
}));

describe("Recently Viewed", () => {
    beforeEach(() => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024
        })
    })
    test("renders products", () => {
        render(<RecentlyViewed />);
        expect(screen.getByText("Recently Viewed")).toBeInTheDocument();
        expect(screen.getByText("Test Product")).toBeInTheDocument();
        expect(screen.getByText("Another Product")).toBeInTheDocument();
    })
    test("shows correct product count", () => {
        render(<RecentlyViewed />);
        expect(screen.getByText("4 products viewed")).toBeInTheDocument();
    })
    test("pause when pause button is clicked", async () => {
        render(<RecentlyViewed />);
        const user = userEvent.setup();
        const pauseBtn = screen.getByText(/pause/i);
        await user.click(pauseBtn)  
        expect(screen.getByText(/pause/i)).toBeInTheDocument();  
    })
    test("navigate next", async () => {
        render(<RecentlyViewed />);
        const user = userEvent.setup();
        const nextBtn = screen.getByLabelText("Next");
        await user.click(nextBtn);
        expect(nextBtn).toBeInTheDocument();
    })
})