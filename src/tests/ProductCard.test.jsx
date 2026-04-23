import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import ProductCard from "../components/ProductCard.jsx"
import { useStore } from "zustand";
import { collections, reviews } from "../data/product";

const mockStore = {
    wishlist: [],
    addToCart: vi.fn(),
    toggleWishlist: vi.fn(),
    showToast: vi.fn(),
    addRecentlyViewed: vi.fn()
};

vi.mock('../store/useStore.js', () => ({
    useStore: (selector) => selector(mockStore)
}));

const product = {
    id: 1,
    name: 'Test Product',
    price: 100,
    oldPrice: 150,
    rating: 4.5,
    reviews: 10,
    collection: 'Shoe',
    inStock: true
};

beforeEach(() => {
    vi.clearAllMocks();
})

describe('Product Card test', () => {
    test('renders products details', () => {
        render(
            <MemoryRouter>
                <ProductCard product={product}/>
            </MemoryRouter>
        );
        expect(screen.getByText(/test product/i)).toBeInTheDocument();
        expect(screen.getByText(/shoe/i)).toBeInTheDocument();
        expect(screen.getByText(/100/)).toBeInTheDocument();
    })
    test('adds product to cart and updates UI', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ProductCard product={product} />
            </MemoryRouter>
        );
        const btn = screen.getByText(/add to cart/i);
        await user.click(btn);
        expect(mockStore.addToCart).toHaveBeenCalledWith(
            product,
            1,
            'One Size',
            'Default'
        );
        expect(mockStore.showToast).toHaveBeenCalledWith(`${product.name} added to cart`);
        expect(await screen.findByText(/✓ added/i)).toBeInTheDocument();
    })
    test('toggles wishlist and shows  correct toast', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ProductCard product={product} />
            </MemoryRouter>
        );
        const btn = screen.getByRole('button', { name: /add to wishlist/i });
        await user.click(btn);
        expect(mockStore.toggleWishlist).toHaveBeenCalledWith(product);
        expect(mockStore.showToast).toHaveBeenCalledWith('Added to wishlist ♥');
    });
    test('removes from wishlist when already wishlisted', async () => {
        mockStore.wishlist = [product];
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ProductCard product={product} />
            </MemoryRouter>
        );
        const btn = screen.getByRole('button', { name: /remove from wishlist/i });
        await user.click(btn);
        expect(mockStore.toggleWishlist).toHaveBeenCalledWith(product);
        expect(mockStore.showToast).toHaveBeenCalledWith(
            'Removed from wishlist'
        );
    });
    test('calls addRescently when card is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ProductCard product={product} />
            </MemoryRouter>
        );
        const link = screen.getByRole('link');
        await user.click(link);
        expect(mockStore.addRecentlyViewed).toHaveBeenCalledWith(product);
    });
})