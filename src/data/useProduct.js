import { useState, useEffect } from "react";
import { products as staticProducts, collections, fetchDummyProducts, } from "../data/product.js";

// Helper: group a flat product array by collection
function groupByCollection(productList) {
    const grouped = {};
    collections.forEach(c => {
        grouped[c.id] = [];
    });
    productList.forEach(product => {
        const col = product.collection || 'other';
        if (!grouped[col]) {
            grouped[col] = []
        }
        grouped[col].push(product);
    });
    return grouped;
}

export function useProducts() {
    const [allProducts, setAllProducts] = useState(staticProducts);
    const [grouped, setGrouped] = useState(() => groupByCollection(staticProducts));
    const [liveLoading, setLiveLoading] = useState(true);
    const [liveError, setLiveError] = useState(null);

    // Live Fetch
    useEffect(() => {
        let cancelled = false;
        async function loadLiveProducts() {
            try {
                setLiveLoading(true);
                setLiveError(null);

                const merged = await fetchDummyProducts();

                if (!cancelled) {
                    setAllProducts(merged);
                    setGrouped(groupByCollection(merged));
                    console.log(`[useProducts] ${merged.length} products loaded and grouped`);
                }
            } catch (error) {
                if (!cancelled) {
                    setLiveError(error.message);
                    console.warn('[useProducts] Live fetch failed, using static data:', error.message);
                }
            } finally {
                if (!cancelled) {
                    setLiveLoading(false);
                }
            }
        }
        loadLiveProducts();

        return () => { cancelled = true; };
    }, []);

    // Get all products for a specific collection
    function getByCollection(collectionId) {
        if (collectionId === 'all') return allProducts;
        return grouped[collectionId] || [];
    }

    // Get a single product by id 
    function getById(id) {
        return allProducts.find(p => p.id === Number(id) || p.id === id) || null;
    }

    //  Search across name, tags, collections, desc
    function search(query) {
        if (!query?.trim()) return allProducts;
        const q = query.toLowerCase();
        return allProducts.filter(p => 
            p.name?.toLowerCase().includes(q) ||
            p.collection?.toLowerCase().includes(q) ||
            p.desc?.toLowerCase().includes(q) || 
            p.tags?.some(t => t.toLowerCase().includes(q))
        );
    }
    return {
        allProducts,
        grouped,
        liveLoading,
        liveError,
        getByCollection, 
        getById,  
        search,
    };
}
