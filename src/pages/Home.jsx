import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/ProductCard.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import { collections } from "../data/product.js";
import styles from "../styles/Home.module.css";
import { useState, useMemo } from "react";

const trust = ['Free delivery over ₦50k', '30-day easy returns', 'Secure payments', 'Authentic products only'];

export default function Home() {
    const { products, loading } = useProducts();
    const featured = useMemo(() => (products || []).filter(p => p.badge === 'hot' || p.rating >= 4.7).slice(0, 4), [products]);
    const onSale = useMemo(() => (products || []).filter(p => p.oldPrice && p.inStock).slice(0, 4), [products]);
    const displayCollections = useMemo(() => collections.filter(c => c.id !== 'all'), []);
    const [imgError, setImgError] = useState({});
    const stats =[
        ['50+', 'Products'], ['8', 'Collections'], ['24h', 'Fast delivery'], ['4.5★', 'Avg rating']
    ];

    return (
        <div>
            {/* Trust bar */}
            <div className={styles.trustBar}>
                {trust.map(t => <span key={t} className={styles.trustItem}>✓ {t}</span>)}
            </div>
            {/* Hero */}
            <div className={styles.hero}>
                <div className={styles.heroTag}>
                    New Arrivals . 2026
                </div>
                <h1 className={styles.heroTitle}>
                    Curated <em className={styles.heroTitleEm}>collections</em><br/>for your lifestyle
                </h1>
                <p className={styles.heroSub}>
                    Fashion, electronics, jewellery & more
                </p>
                <div className={styles.heroBtns}>
                    <Link to="/shop" className={styles.heroBtn}>Shop All Collections</Link>
                    <Link to="/shop?badge=sale" className={styles.heroBtnOutline}>View Sales</Link>
                </div>
                <div className={styles.heroStats}>
                    const stats = 
                    {stats.map(([val, label]) => (
                        <div key={label} className={styles.heroStat}>
                            <strong className={styles.heroStatVal}>{val}</strong>
                            <span className={styles.heroStatLabel}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Collections */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Shop by Collection</h2>
                </div>
                <div className={styles.collectionsGrid}>
                    {displayCollections.map(c => (
                        <Link key={c.id} to={`/shop?c=${encodeURIComponent(c.id)}`} className={styles.collectionCard}>
                            <div className={styles.collectionImg}>
                                {!imgError[c.id] && c.img ? (
                                    <img src={c.img} alt={c.label} onError={() => setImgError(prev => ({...prev, [c.id]: true}))} loading="lazy"/>
                                ): (
                                    <span className={styles.collectionFallback}>{c.emoji}</span>
                                )}
                            </div>
                            <div className={styles.collectionBody}>
                                <p className={styles.collectionEmoji}>{c.emoji}</p>
                                <h3 className={styles.collectionName}>{c.label}</h3>
                                <p className={styles.collectionDesc}>{c.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {/* Featured */}
            <div className={styles.sectionWhite}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Products</h2>
                    <Link to="/shop" className={styles.sectionLink}>View all →</Link>
                </div>
                <div className={styles.grid4}>
                    {loading && featured.length === 0
                        ? Array.from({length:4}).map((_,i) => (
                            <div key={i} style={{background:'var(--off)',borderRadius:'var(--r)',aspectRatio:'1/1',animation:'shimmer 1.4s infinite',backgroundSize:'200% 100%',backgroundImage:'linear-gradient(90deg,var(--bg) 25%,var(--border) 50%,var(--bg) 75%)'}} />
                        ))
                        : featured.map(p => <ProductCard key={p.id} product={p} />)
                        }
                </div>
            </div>
            {/* Sale Banner */}
            <div className={styles.saleBanner}>
                <div className={styles.saleBannerText}>
                    <p className={styles.saleBannerTag}>Limited Time</p>
                    <h2 className={styles.saleBannerTitle}>
                        Up to 25% off <br /><em className={styles.saleBannerTitleEm}>selected items</em>
                    </h2>
                    <p className={styles.saleBannerSub}>Use code <strong>SAVE10</strong> at checkout for extra savings</p>
                </div>
                <Link to="/shop?badge=sale" className={styles.saleBannerBtn}>Shop the Sale</Link>
            </div>

            {/* On Sale */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>On Sale Now</h2>
                    <Link to="/shop?badge=sale" className={styles.sectionLink}>View all →</Link>
                </div>
                <div className={styles.grid4}>
                    {onSale.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>

            {/* Recently Viewed */}
            <RecentlyViewed />
        </div>
    );
}