import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Home from "../pages/Home.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { products } from "../data/product";

// Mock useProducts
vi.mock("../hooks/useProducts.js", () => ({
    useProducts: () => ({
        products: [
            { id: 1, name: "Product A", rating: 4.8, badge: "hot", price: 100 },
            { id: 2, name: "Product B", rating: 4.9, price: 200 }
        ],
        loading: false,
    }),
}));

// Mock ProductCard 
vi.mock("../components/ProductCard.jsx", () => ({
    default: ({ product }) => <div>{product.name}</div>
}));

// Mock RecentlyViewed 
vi.mock("../components/RecentlyViewed.jsx", () => ({
    default: () => <div>Recently Viewed Section</div>
}));

// Mock react-router Link 
vi.mock("react-router-dom", () =>({
    Link: ({ to, children }) => <a href={to}>{children}</a>
}));


// Describe
describe("Home Page", () => {
    test("renders key sections", () => {
        render(<Home />);
        expect(screen.getByText(/shop by collection/i)).toBeInTheDocument();
        expect(screen.getByText(/featured products/i)).toBeInTheDocument();
        expect(screen.getByText(/on sale now/i)).toBeInTheDocument();
    });
    test('render products', () => {
        render(<Home />);
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();
    })
    test("renders navigation links correctly", () => {
        render(<Home />);
        expect(screen.getByRole("link", { name: /shop all collections/i })).toHaveAttribute("href", "/shop");
        expect(screen.getByRole("link", { name: /view sales/i })).toHaveAttribute("href", "/shop?badge=sale");
    })
})