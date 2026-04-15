// Mock the entire product data
vi.mock('../data/product', () => {
    return {
        products: [
            { id: 1001, name: 'Nike Air Force 1', collection: 'sneakers', price: 68000 },
            { id: 1002, name: 'Adidas Ultraboost', collection: 'sneakers', price: 95000 },
        ],
        fetchDummyProducts:vi.fn(),
        collections: [],
        FALLBACK_IMAGES: {},
    };
});
import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "../hooks/useProducts";
import { fetchDummyProducts, } from "../data/product";
// Helper 
// const makeLiveProducts = (count = 3) => {
//     Array.from({ length: count }, (_, i) => ({
//         id: 2001 + i,
//         name: `Live Products ${i + 1}`,
//         collection: 'electroonics',
//         price: 100000 + i * 10000,
//     }));
// }
describe('useProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    test('return static products Immediately before the live fetch completes', () => {
        const { result } = renderHook(() => useProducts());
        expect(result.current.products).toEqual([
            { id: 1001, name: 'Nike Air Force 1', collection: 'sneakers', price: 68000 },
            { id: 1002, name: 'Adidas Ultraboost', collection: 'sneakers', price: 95000 }
        ]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);
    });
    test('starts with loading set to true', () => {
        const { result } = renderHook(() => useProducts());
        expect(result.current.loading).toBe(true);
    });
    test('updates products after successful fetch', async () => {
  fetchDummyProducts.mockResolvedValue([
    { id: 2001, name: 'Live Products', collection: 'electronics', price: 120000 }
  ]);

  const { result } = renderHook(() => useProducts());

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.products).toEqual([
    { id: 2001, name: 'Live Products', collection: 'electronics', price: 120000 }
  ]);
});
})