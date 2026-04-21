import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
// Import your custom hook, not the base zustand library
import { useStore } from "../store/useStore.js"; 

const setCartOpen = vi.fn();

const mockStore = {
    cart: [],
    cartOpen: false,
    setCartOpen,
    user: null,
    logout: vi.fn(),
    wishlist: [],
    searchQuery: '',
    setSearchQuery: vi.fn(),
    showToast: vi.fn()
};

// Mock Store
vi.mock('../store/useStore.js', () => ({
    useStore: (selector) => selector(mockStore)
}));

// Mock Theme Context with Named Exports
vi.mock('../context/ThemeContext.jsx', () => ({
    __esModule: true,
    ThemeProvider: ({ children }) => children,
    useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
    // Explicitly define the named export for the toggle component
    ThemeToggle: () => <button aria-label="Toggle theme">🌙</button>,
}));

describe('Navbar component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('toggles cart open state', async () => {
        const user = userEvent.setup(); // Setup before render
        
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const cartBtn = screen.getByLabelText(/open cart/i);
        await user.click(cartBtn);

        expect(setCartOpen).toHaveBeenCalledTimes(1);
    });

    test('shows user account menu when clicked', async () => {
        const user = userEvent.setup();
        
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const accountBtn = screen.getByLabelText(/account menu/i);
        await user.click(accountBtn);

        // Verify dropdown items appear
        expect(screen.getByText(/log in/i)).toBeInTheDocument();
        expect(screen.getByText(/create account/i)).toBeInTheDocument();
    });
});