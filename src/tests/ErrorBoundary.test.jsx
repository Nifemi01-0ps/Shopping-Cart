import { describe, test, expect, beforeAll, vi, afterAll } from "vitest";
import  ErrorBoundary  from "../components/ErrorBoundary.jsx";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// Suppress React error boundary console noise 
beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
    
})
// Helpers
// Function Bomb
function Bomb() {
    throw new Error("Boom");
    
}

// Toggleable child
import { useState } from "react";
function ToggleBomb() {
    const [explode, setExplode] = useState(false);
    if (explode) throw new Error("Toggle Boom");
    return <button onClick={() =>setExplode(true)}>Trigger Error</button>;
}
function wrapper(ui) {
    return render(<MemoryRouter>{ui}</MemoryRouter>)
}
describe('ErrorBoundary', () => {
    test('renders children normally', () => {
        wrapper(
            <ErrorBoundary>
                <p>Hello ShopFlow</p>
            </ErrorBoundary>
        )
        expect(screen.getByText('Hello ShopFlow')).toBeInTheDocument();
    });
    test('render minimal UI and allows retry click', async () => {
        const user = userEvent.setup();
        wrapper(
            <ErrorBoundary minimal>
                <Bomb />
            </ErrorBoundary>
        );
        const button = screen.getByText(/try again/i);
        expect(button).toBeInTheDocument();
        await user.click(button);
    })
    test('renders full UI with detailed message when minimal is false', () => {
        wrapper(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>
        );
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/Your cart and account are safe/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /go home/i })).toBeInTheDocument();
    })
    
});