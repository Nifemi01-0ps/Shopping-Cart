import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts } from '../data/useProduct.js';

vi.mock('../data/product', () => ({
  collections: [
    { id: 'sneakers',    label: 'Sneakers' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'nivea',       label: 'Nivea' },
  ],
  products: [
    { id: 1001, name: 'Nike Air Force 1',   collection: 'sneakers', price: 68000, tags: ['Nike'],  desc: 'Classic sneaker' },
    { id: 1002, name: 'Adidas Ultraboost',  collection: 'sneakers', price: 95000, tags: ['Adidas'],desc: 'Running shoe' },
    { id: 1017, name: 'Nivea Men Facewash', collection: 'nivea',    price: 4200,  tags: ['Nivea'], desc: 'Carbon facewash' },
  ],
  fetchDummyProducts: vi.fn(),
}));

import { fetchDummyProducts } from '../data/product.js';

const makeLiveProducts = (count = 4) =>
  Array.from({ length: count }, (_, i) => ({
    id: 2001 + i,
    name: `Live Product ${i + 1}`,
    collection: i % 2 === 0 ? 'sneakers' : 'electronics',
    price: 50000 + i * 5000,
    tags: ['live', `tag${i}`],
    desc: `Live product description ${i + 1}`,
  }));

describe('useProducts', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  // ── Initial state ───────────────────────────────────────────────────────────
  describe('initial state', () => {
    test('serves static products immediately before live fetch completes', () => {
      fetchDummyProducts.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProducts());
      expect(result.current.allProducts).toHaveLength(3);
      expect(result.current.allProducts[0].name).toBe('Nike Air Force 1');
    });

    test('starts with liveLoading set to true', () => {
      fetchDummyProducts.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProducts());
      expect(result.current.liveLoading).toBe(true);
    });

    test('starts with liveError set to null', () => {
      fetchDummyProducts.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProducts());
      expect(result.current.liveError).toBeNull();
    });

    test('grouped is initialised from static products immediately', () => {
      fetchDummyProducts.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProducts());
      expect(result.current.grouped['sneakers']).toHaveLength(2);
      expect(result.current.grouped['nivea']).toHaveLength(1);
      expect(result.current.grouped['electronics']).toHaveLength(0);
    });

    test('returns all expected keys', () => {
      fetchDummyProducts.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProducts());
      const keys = Object.keys(result.current);
      ['allProducts','grouped','liveLoading','liveError','getByCollection','getById','search']
        .forEach(key => expect(keys).toContain(key));
    });
  });

  // ── Successful live fetch ───────────────────────────────────────────────────
  describe('successful live fetch', () => {
    test('replaces static products with live products', async () => {
      fetchDummyProducts.mockResolvedValue(makeLiveProducts(4));
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
      expect(result.current.allProducts).toHaveLength(4);
      expect(result.current.allProducts[0].name).toBe('Live Product 1');
    });

    test('sets liveLoading to false after fetch completes', async () => {
      fetchDummyProducts.mockResolvedValue(makeLiveProducts());
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
    });

    test('keeps liveError as null after successful fetch', async () => {
      fetchDummyProducts.mockResolvedValue(makeLiveProducts());
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
      expect(result.current.liveError).toBeNull();
    });

    test('updates grouped when live products load', async () => {
      fetchDummyProducts.mockResolvedValue(makeLiveProducts(4));
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
      expect(result.current.grouped['sneakers']).toHaveLength(2);
      expect(result.current.grouped['electronics']).toHaveLength(2);
    });

    test('calls fetchDummyProducts exactly once on mount', async () => {
      fetchDummyProducts.mockResolvedValue(makeLiveProducts());
      renderHook(() => useProducts());
      await waitFor(() => expect(fetchDummyProducts).toHaveBeenCalledTimes(1));
    });
  });

  // ── Failed live fetch ───────────────────────────────────────────────────────
  describe('failed live fetch', () => {
    test('keeps static products when fetch fails', async () => {
      fetchDummyProducts.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
      expect(result.current.allProducts).toHaveLength(3);
      expect(result.current.allProducts[0].id).toBe(1001);
    });

    test('sets liveError with the error message', async () => {
      fetchDummyProducts.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
      expect(result.current.liveError).toBe('Network error');
    });

    test('sets liveLoading to false even when fetch fails', async () => {
      fetchDummyProducts.mockRejectedValue(new Error('Timeout'));
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
    });

    test('grouped stays intact with static data when fetch fails', async () => {
      fetchDummyProducts.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.liveLoading).toBe(false));
      expect(result.current.grouped['sneakers']).toHaveLength(2);
    });
  });

  // ── getByCollection ─────────────────────────────────────────────────────────
  describe('getByCollection', () => {
    beforeEach(() => { fetchDummyProducts.mockReturnValue(new Promise(() => {})); });

    test('returns only products from the requested collection', () => {
      const { result } = renderHook(() => useProducts());
      const sneakers = result.current.getByCollection('sneakers');
      expect(sneakers).toHaveLength(2);
      sneakers.forEach(p => expect(p.collection).toBe('sneakers'));
    });

    test('returns empty array for a collection with no products', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.getByCollection('electronics')).toEqual([]);
    });

    test('returns empty array for an unknown collection id', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.getByCollection('unknown')).toEqual([]);
    });
  });

  // ── getById ─────────────────────────────────────────────────────────────────
  describe('getById', () => {
    beforeEach(() => { fetchDummyProducts.mockReturnValue(new Promise(() => {})); });

    test('returns the correct product with a numeric id', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.getById(1001).name).toBe('Nike Air Force 1');
    });

    test('returns the correct product with a string id', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.getById('1002').name).toBe('Adidas Ultraboost');
    });

    test('returns null when the id does not exist', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.getById(9999)).toBeNull();
    });

    test('returns null for undefined id', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.getById(undefined)).toBeNull();
    });
  });

  // ── search ──────────────────────────────────────────────────────────────────
  describe('search', () => {
    beforeEach(() => { fetchDummyProducts.mockReturnValue(new Promise(() => {})); });

    test('returns all products when query is empty', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.search('')).toHaveLength(3);
    });

    test('returns all products when query is only whitespace', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.search('   ')).toHaveLength(3);
    });

    test('returns all products when query is null', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.search(null)).toHaveLength(3);
    });

    test('finds products by name (case insensitive)', () => {
      const { result } = renderHook(() => useProducts());
      const results = result.current.search('nike');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Nike Air Force 1');
    });

    test('finds products by collection name', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.search('sneakers')).toHaveLength(2);
    });

    test('finds products by tag', () => {
      const { result } = renderHook(() => useProducts());
      const results = result.current.search('adidas');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Adidas Ultraboost');
    });

    test('finds products by description', () => {
      const { result } = renderHook(() => useProducts());
      const results = result.current.search('carbon');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Nivea Men Facewash');
    });

    test('returns empty array when no products match', () => {
      const { result } = renderHook(() => useProducts());
      expect(result.current.search('xyznotaproduct')).toHaveLength(0);
    });
  });

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  describe('cleanup', () => {
    test('does not update state after the component unmounts', async () => {
      let resolvePromise;
      fetchDummyProducts.mockReturnValue(
        new Promise(resolve => { resolvePromise = resolve; })
      );
      const { result, unmount } = renderHook(() => useProducts());
      unmount();
      act(() => { resolvePromise(makeLiveProducts()); });
      await new Promise(r => setTimeout(r, 50));
      expect(result.current.allProducts).toHaveLength(3);
    });
  });
});