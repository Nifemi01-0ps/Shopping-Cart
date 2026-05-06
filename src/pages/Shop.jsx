import { useState, useMemo, memo } from "react";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router-dom";
import { collections as ALL_COLLECTIONS } from "../data/products.js";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import styles from "../styles/Shop.module.css";

const STATS = [
  ['all',     'All items'   ],
  ['instock', 'In stock only'],
  ['sale',    'On sale'     ],
];

const RATINGS = [
  [0,   'Any'   ],
  [4,   '4★+'   ],
  [4.5, '4.5★+' ],
];

const GRID_SHAPES = [
  ['grid', '⊞'],
  ['list', '≡' ],
];

// ── Filter Sidebar ────────────────────────────────────────────────────────────
const FilterSidebar = memo(function FilterSidebar({
  sort, setSort,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  avail, setAvail,
  minRating, setMinRating,
  onClear,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Sort By</p>
        <select className={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="new">Newest First</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Price (₦)</p>
        <div className={styles.priceRow}>
          <input type="number" className={styles.priceInput} value={priceMin}
            onChange={e => setPriceMin(e.target.value)} placeholder="Min" />
          <span className={styles.priceSep}>–</span>
          <input type="number" className={styles.priceInput} value={priceMax}
            onChange={e => setPriceMax(e.target.value)} placeholder="Max" />
        </div>
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Availability</p>
        <div className={styles.filterChips}>
          {STATS.map(([val, label]) => (
            <button key={val} onClick={() => setAvail(val)}
              className={`${styles.filterChip} ${avail === val ? styles.filterChipActive : ''}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Min. Rating</p>
        <div className={styles.ratingBtns}>
          {RATINGS.map(([val, label]) => (
            <button key={val} onClick={() => setMinRating(val)}
              className={`${styles.ratingBtn} ${minRating === val ? styles.ratingBtnActive : ''}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onClear} className={styles.clearBtn}>Clear all filters</button>
    </aside>
  );
});

// ── Shop Page ──
export default function Shop() {
  const [param, setParam]       = useSearchParams();
  const products                = useStore(st => st.products);
  const loading                 = useStore(st => st.productsLoading);
  const searchQuery             = useStore(st => st.searchQuery);
  const [debouncedQuery]        = useDebounce(searchQuery, 300);

  const [sort,      setSort     ] = useState('default');
  const [avail,     setAvail    ] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [priceMin,  setPriceMin ] = useState('');
  const [priceMax,  setPriceMax ] = useState('');
  const [view,      setView     ] = useState('grid');

  const coll        = param.get('c')     || 'all';
  const badgeFilter = param.get('badge') || null;
  const urlQ        = param.get('q')     || '';

  const setColl = c => {
    const p = new URLSearchParams(param);
    p.set('c', c);
    p.delete('badge');
    setParam(p);
  };

  // Step 1 — filter only (no sorting)
  const filteredList = useMemo(() => {
    const q = (urlQ || debouncedQuery).toLowerCase();
    return (products || []).filter(p => {
      if (coll !== 'all' && p.collection !== coll) return false;
      if (badgeFilter && p.badge !== badgeFilter) return false;
      if (q && !p.nameLower?.includes(q) &&
               !p.collectionLower?.includes(q) &&
               !p.descLower?.includes(q) &&
               !p.tagsLower?.some(t => t.includes(q))) return false;
      const mn = Number(priceMin) || 0;
      const mx = parseFloat(priceMax) || Infinity;
      if (p.price < mn || p.price > mx) return false;
      if (avail === 'instock' && !p.inStock)  return false;
      if (avail === 'sale'    && !p.oldPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
  }, [products, coll, badgeFilter, urlQ, debouncedQuery, priceMin, priceMax, avail, minRating]);

  // 
  const sortedList = useMemo(() => {
    const list = [...filteredList];
    if (sort === 'price-asc')  return list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     return list.sort((a, b) => b.rating - a.rating);
    if (sort === 'new')        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sort === 'discount')   return list.sort((a, b) =>
      (b.oldPrice ? b.oldPrice - b.price : 0) - (a.oldPrice ? a.oldPrice - a.price : 0)
    );
    return list;
  }, [filteredList, sort]);

  const clearFilters = () => {
    setSort('default'); setAvail('all');
    setPriceMin('');    setPriceMax('');
    setMinRating(0);
  };

  const currentCollLabel =
    ALL_COLLECTIONS.find(c => c.id === coll)?.label || 'All Products';

  return (
    <div>
      {/* Collection tabs */}
      <div className={styles.collTabs} role="tablist">
        {ALL_COLLECTIONS.map(c => (
          <button key={c.id} role="tab" aria-selected={coll === c.id}
            onClick={() => setColl(c.id)}
            className={`${styles.collTab} ${coll === c.id ? styles.collTabActive : ''}`}>
            <span aria-hidden="true">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <FilterSidebar
          sort={sort}           setSort={setSort}
          priceMin={priceMin}   setPriceMin={setPriceMin}
          priceMax={priceMax}   setPriceMax={setPriceMax}
          avail={avail}         setAvail={setAvail}
          minRating={minRating} setMinRating={setMinRating}
          onClear={clearFilters}
        />

        <main className={styles.main}>
          {/* Grid header */}
          <div className={styles.gridHeader}>
            <div className={styles.gridTitle}>
              {currentCollLabel}
              {badgeFilter && (
                <span className={styles.saleLabel}>On Sale</span>
              )}
            </div>
            <div className={styles.viewToggle}>
              {GRID_SHAPES.map(([mode, icon]) => (
                <button key={mode} onClick={() => setView(mode)}
                  className={`${styles.viewBtn} ${view === mode ? styles.viewBtnActive : ''}`}
                  aria-label={`${mode} view`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Skeleton loading */}
          {loading && sortedList.length === 0 && (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImg} />
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonLineShort} />
                    <div className={styles.skeletonLineLong} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && sortedList.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔍</div>
              <p className={styles.emptyText}>No products found</p>
              <p>Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Product grid */}
          {sortedList.length > 0 && (
            <div className={`${styles.grid} ${view === 'list' ? styles.gridList : ''}`}>
              {sortedList.map(p => (
                <ProductCard key={p.id} product={p} listView={view === 'list'} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}