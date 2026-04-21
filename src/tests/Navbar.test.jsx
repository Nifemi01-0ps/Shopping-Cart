import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useStore } from "zustand";
// Mock Functions
const setCartOpen = vi.fn();
const setSearchQuery = vi.fn();
const logout = vi.fn();
const showToast = vi.fn();
const mockNavigate = vi.fn();

// Shared Mock Store
const mockStore = {
    cart: [],
    cartOpen: false,
    setCartOpen,
    user: { name: 'John Doe' },
    logout,
    wishlist: [1, 2],
    searchQuery: '',
    setSearchQuery,
    showToast
}
// Mock Store
vi.mock('../store/useStore.js', () => ({
    useStore: (selector) => selector(mockStore)
}));
// Mock Theme
vi.mock('../context/ThemeContext.jsx', () => ({
    ThemeProvider: ({ children }) => children,
    useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
    ThemeToggle: () => <button aria-label="Toggle theme" />,
}));
//  useNavigate mock
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate}
});

describe('Navbar test', () => {
    beforeEach(() => {
        setCartOpen.mockClear();
    });
        test('toogles cart open state', async () => {
            render (
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
            const user = userEvent.setup();
            const cartBtn = screen.getByLabelText(/open cart/i);
            await user.click(cartBtn);
            expect(setCartOpen).toHaveBeenCalled();
        });
        test('show wishlist badge count correctly', () => {
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
            expect(screen.getByText('2')).toBeInTheDocument();
        })
        test('updates search input value', async () => {
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
            const user = userEvent.setup();
            const input = screen.getByLabelText(/search products/i);
            await user.type(input, 'Iphone');
            expect(setSearchQuery).toHaveBeenCalled();
        })
        test('logout clears user session and show toast', async () => {
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
            const user = userEvent.setup();
            await user.click(screen.getByLabelText(/account menu/i));
            await user.click(screen.getByText(/log out/i));

            expect(logout).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith("Logged out successfully");
        });
        test('submit search form and navigate to shop page', async () => {
            const user = userEvent.setup();
            mockStore.searchQuery = 'macbook';
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
            const input = screen.getByPlaceholderText(/search product/i);
            await user.type(input, '{enter}')
            expect(mockNavigate).toHaveBeenCalledWith('/shop?q=macbook');
        });
        test('toogles search bar visibility on mobile icon click', async () => {
            const user = userEvent.setup();
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
            const toggleBtn = screen.getByLabelText(/toggle search/i);
            const form = screen.getByRole('search', { hidden: true });
            await user.click(toggleBtn)
            expect(form.className).toContain('showSearch');
        })
    })  
