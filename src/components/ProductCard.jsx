import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { fmt, starsStr, discountPct, isWishlisted as checkWishlisted, truncate } from "../utils/index.js";
import ImageWithFallback from "../components/ImageWithFallback.jsx";
import styles from "../styles/ProductCard.module.css";

function ProductCard({ product, listView }) {
  const wishlist          = useStore(st => st.wishlist);
  const addToCart         = useStore(st => st.addToCart);
  const toggleWishlist    = useStore(st => st.toggleWishlist);
  const showToast         = useStore(st => st.showToast);
  const addRecentlyViewed = useStore(st => st.addRecentlyViewed);

  const wishlisted = checkWishlisted(wishlist, product.id);
  const [added, setAdded] = useState(false);
  const d = discountPct(product.price, product.oldPrice);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = e => {
    e.stopPropagation();
    if (!product.inStock) return;
    const sizes  = product?.sizes?.length  ? product.sizes  : ['One Size'];
    const colors = product?.colors?.length ? product.colors : ['Default'];
    addToCart(product, 1, sizes[0], colors[0]);
    showToast(`${product.name} added to cart`);
    setAdded(true);
  };

  const handleWishlist = e => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(!wishlisted ? 'Added to wishlist ♥' : 'Removed from wishlist');
  };

  const badgeClass = product.badge === 'sale' ? styles.badgeSale
    : product.badge === 'new' ? styles.badgeNew : styles.badgeHot;
  const badgeLabel = product.badge === 'sale' ? `-${d}%`
    : product.badge === 'new' ? 'New' : 'Hot';

  const imgSrc   = product?.imgs?.[0] || product?.img || '';
  const fallback = product?.fallbackImg || null;

  return (
    <article
      className={[
        styles.card,
        listView ? styles.cardList : '',
        !product.inStock ? styles.cardOutOfStock : '',
      ].filter(Boolean).join(' ')}
    >
      {/* ── Clickable image + info area ── */}
      <Link
        to={`/product/${product.id}`}
        state={{ product }}
        onClick={() => addRecentlyViewed(product)}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div className={styles.imageWrap}>
          <ImageWithFallback
            src={imgSrc}
            alt={product.name}
            collection={product.collection}
            fallbackSrc={fallback}
            className={styles.image}
            style={{ width: '100%', height: '100%', objectFit: 'cover', padding: 20, transition: 'transform 0.4s ease' }}
            loading="lazy"
            width="400"
            height="400"
          />
          {product.badge && (
            <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
          )}
          {!product.inStock && (
            <div className={styles.cardOutOfStockOverlay}>
              <span className={styles.outOfStockLabel}>Out of Stock</span>
            </div>
          )}
        </div>

        <div className={styles.body}>
          <p className={styles.collection}>{product.collection}</p>
          <p className={styles.name}>{product.name}</p>
          {listView && <p className={styles.desc}>{truncate(product.desc, 100)}</p>}
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{starsStr(product.rating)}</span>
            <span className={styles.reviews}>{product.rating} ({product.reviews})</span>
          </div>
        </div>
      </Link>

      {/* ── Buttons live outside the Link ── */}
      <div className={styles.footer}>
        <div>
          <span className={styles.price}>{fmt(product.price)}</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>{fmt(product.oldPrice)}</span>
          )}
        </div>
        <button
          onClick={handleWishlist}
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistBtnActive : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
        {product.inStock ? (
          <button
            onClick={handleAdd}
            className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
            aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        ) : (
          <span className={styles.outOfStockText}>Out of stock</span>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);