import { useState, useEffect } from 'react';
import { products as staticProducts, fetchDummyProducts } from '../data/product.js';

export function useProducts() {
  // Serve static data immediately — zero latency, always works
  const [allProducts, setAllProducts] = useState(staticProducts);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function tryLiveUpgrade() {
      try {
        // fetchDummyProducts() already merges YOUR_PRODUCTS + live DummyJSON
        // and falls back to static internally if the network fails
        const merged = await fetchDummyProducts();
        if (!cancelled) {
          setAllProducts(merged);
          console.log(`[ShopFlow] Live upgrade complete — ${merged.length} products loaded`);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    tryLiveUpgrade();
    return () => { cancelled = true; };
  }, []);

  return { products: allProducts, loading, error };
}