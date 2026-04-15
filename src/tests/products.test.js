import { describe, test, expect } from "vitest";
import {
  YOUR_PRODUCTS,
  FALLBACK_IMAGES,
  products,
  collections,
  coupons,
} from "../data/product.js";

describe('YOUR_PRODUCTS', () => {
  test('contains 21 products', () => {
    expect(YOUR_PRODUCTS).toHaveLength(21);
  });

  test('has no duplicate ids', () => {
    const ids = YOUR_PRODUCTS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('imgs is always an array with at least one item', () => {
    YOUR_PRODUCTS.forEach(p => {
      expect(Array.isArray(p.imgs)).toBe(true);
      expect(p.imgs.length).toBeGreaterThan(0);
    });
  });

  test('all collections are valid known collection ids', () => {
    const validCollections = [
      'sneakers', 'wristwatches', 'oriamo', 'nivea',
      "men's fashion", "women's fashion", 'electronics',
      'jewellery', 'beauty & care',
    ];
    YOUR_PRODUCTS.forEach(p => {
      expect(validCollections).toContain(p.collection);
    });
  });

  test('ratings are between 1 and 5', () => {
    YOUR_PRODUCTS.forEach(p => {
      expect(p.rating).toBeGreaterThanOrEqual(1);
      expect(p.rating).toBeLessThanOrEqual(5);
    });
  });

  test('oldPrice is null or greater than price', () => {
    YOUR_PRODUCTS.forEach(p => {
      if (p.oldPrice !== null) {
        expect(p.oldPrice).toBeGreaterThan(p.price);
      }
    });
  });

  test('each product has required fields', () => {
    YOUR_PRODUCTS.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('collection');
      expect(p).toHaveProperty('price');
      expect(p).toHaveProperty('img');
    });
  });
});

describe('products (combined)', () => {
  test('contains YOUR_PRODUCTS + dummyjson static (51 total)', () => {
    expect(products).toHaveLength(51);
  });

  test('all combined product ids are unique', () => {
    const ids = products.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('collections', () => {
  test('has 10 entries', () => {
    expect(collections).toHaveLength(10);
  });

  test('first collection is "all"', () => {
    expect(collections[0].id).toBe('all');
  });

  test('collection ids are unique', () => {
    const ids = collections.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('coupons', () => {
  test('contains exactly 3 codes', () => {
    expect(Object.keys(coupons)).toHaveLength(3);
  });

  test('SAVE10 gives 10% discount', () => {
    expect(coupons['SAVE10']).toBe(10);
  });

  test('WELCOME20 gives 20% discount', () => {
    expect(coupons['WELCOME20']).toBe(20);
  });

  test('FLASH15 gives 15% discount', () => {
    expect(coupons['FLASH15']).toBe(15);
  });
});

describe('FALLBACK_IMAGES', () => {
  test('has a default entry', () => {
    expect(FALLBACK_IMAGES).toHaveProperty('default');
  });
});