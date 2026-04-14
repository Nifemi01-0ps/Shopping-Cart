import { describe, it, expect, vi, beforeEach, afterEach, test } from "vitest";
import { YOUR_PRODUCTS, FALLBACK_IMAGES, PICSUM_FALLBACKS, products, collections, coupons, CUSTOM_PRODUCTS, fetchDummyProducts } from "../data/products.js";
// Your Product
describe('Your Products', () => {
    test('contains 21 products', () => {
        expect(YOUR_PRODUCTS).toHaveLength(21);
    });
    test('it has no duplicate ids', () => {
        const ids = YOUR_PRODUCTS.map(p => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    })
    test('imgs is always an array with at least one item', () => {
        YOUR_PRODUCTS.forEach(p => {
            expect(Array.isArray(p.imgs)).toBe(true);
            expect(p.imgs.length).toBeGreaterThan(0);
        });
    });
    test('all collections are valid known collection ids', () => {
        const validCollections = [ 'sneakers', 'wristwatches', 'oriamo', 'nivea', "men's fashion", "women's fashion", 'electronics', 'jewellery', 'beauty & care' ];
        YOUR_PRODUCTS.forEach(p => {
            expect(validCollections).toContain(p.collection);
        })
    })
    test('all ids are unique', () => {
        const ids = YOUR_PRODUCTS.map(p => p.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
    });
    test('ratings are between 1 and 5', () => {
        YOUR_PRODUCTS.forEach(p => {
            expect(p.rating).toBeGreaterThanOrEqual(1);
            expect(p.rating).toBeLessThanOrEqual(5);
        })
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
    })
    // Products(Combined)
    describe('products (combined)', () => {
        test('contains YOUR_PRODUCTS + dummyjson static', () => {
            expect(products).toHaveLength(51);
        });
        test('all combined products are unique', () => {
            const ids = products.map(p => p.id)
            expect(new Set(ids).size).toBe(ids.length);
        });
    })
    describe('collections', () => {
        test('has 10 entries', () => {
            expect(collections).toHaveLength(10);
        });
        test('first collection is "all"', () => {
            expect(collections[0].id).toBe('all');
        });
        test('collection ids are unique', () => {
            const ids = collections.map(p => p.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });
    // Coupons 
    describe('codes', () => {
        test('contain exactly 3 codes', () => {
            expect(Object.keys(coupons)).toHaveLength(3);
        });
        test('SAVE10 gives 10% discount', () => {
            expect(coupons['SAVE10']).toBe(10);
        });
        test('WELCOME20 gives 20% discount', () => {
            expect(coupons['WELCOME20']).toBe(20);
        });
        test('FLASHES gives 15% discount', () => {
            expect(coupons['FLASH15']).toBe(15);
        });
    });
    describe('Fallback images', () => {
        test('has a default entry', () => {
            expect(FALLBACK_IMAGES).toHaveProperty('default');
        });
    })
})