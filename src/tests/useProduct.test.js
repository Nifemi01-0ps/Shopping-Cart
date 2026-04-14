import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "../hooks/useProducts";
import { collections, fetchDummyProducts, products } from "../data/product";
// Mock the entire product data
vi.mock('../data/products', () => {
    return {
        products: [
            { id: 1001, name: 'Nike Air Force 1', collection: 'sneakers', price: 68000 },
            { id: 1002, name: 'Adidas Ultraboost', collection: 'sneakers', price: 95000 },
        ],
        fetchDummyProducts:vi.fn(),
        collections: []
    };
});
describe('useProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    test('return static products Immediately before the live fetch completes', () => {
        const { result } = renderHook(() => useProducts());
        expect(result.current.products).toHaveLength(2);
        expect(result.current.products[0].name).toBe('Nike Air Force 1');
    });
    test('starts with loading set to true', () => {
        const { result } = renderHook(() => useProducts());
        expect(result.current.loading).toBe(true);
    });
    // Successful live fetch
    test('replaces static product with current product after fetch succeeds', async () => {
        const liveProducts = makeLiveProducts(5);
        fetchDummyProducts.mockResolvedValue(liveProducts);
        const { result } = renderHook(() => useProducts());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.products).toHaveLength(5);
        expect(result.current.products[0].name).toBe('Live Products 1');
    });
})