import { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { fmt, starsStr } from "../utils/index.js";
import styles from "../styles/RecentlyViewed.module.css";

function useVisibleCount() {
  const getCount = () =>
    window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
  const [count, setCount] = useState(getCount);
  useEffect(() => {
    const handler = () => setCount(getCount());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return count;
}

function RecentlyViewed() {
  const recentlyViewed = useStore(st => st.recentlyViewed);

  const [current,   setCurrent]   = useState(0);
  const [paused,    setPaused]    = useState(false);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const timerRef = useRef(null);

  const items    = (recentlyViewed || []).filter(p => p && p.id && p.name);
  const visibleCount = useVisibleCount();
  const VISIBLE = Math.min(items.length, visibleCount);
  const canSlide = items.length > VISIBLE;

  const goTo = (idx, dir = 'next') => {
    if (animating || items.length === 0) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 320);
  };

  const prev = () => goTo(current === 0 ? items.length - 1 : current - 1, 'prev');
  const next = () => goTo(current === items.length - 1 ? 0 : current + 1, 'next');

  // Auto-advance every 3.5s
  useEffect(() => {
    if (!canSlide || paused) return;
    timerRef.current = setInterval(next, 3500);
    return () => clearInterval(timerRef.current);
  }, [current, paused, canSlide, items.length]);

  if (items.length === 0) return null;

  // Build the visible slice
  const visibleItems = Array.from({ length: VISIBLE }, (_, i) =>
    items[(current + i) % items.length]
  );

  return (
    <section className={styles.section}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Recently Viewed</h2>
          <p className={styles.subtitle}>
            {items.length} product{items.length !== 1 ? 's' : ''} viewed
          </p>
        </div>

        {canSlide && (
          <div className={styles.controls}>
            <div className={styles.dots}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                  className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
                  aria-label={`Go to item ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={prev} className={styles.navBtn} aria-label="Previous">‹</button>
            <button onClick={next} className={styles.navBtn} aria-label="Next">›</button>
          </div>
        )}
      </div>

      {/* ── Track ── */}
      <div
        className={styles.trackWrapper}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {canSlide && (
          <div className={styles.pauseWrap}>
            <button onClick={() => setPaused(p => !p)} className={styles.pauseBtn}>
              {paused ? <>▶ Resume</> : <>⏸ Pause</>}
            </button>
          </div>
        )}

        <div
          className={styles.track}
          style={{
            gridTemplateColumns: `repeat(${VISIBLE}, 1fr)`,
            opacity:   animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === 'next' ? '-24px' : '24px'})`
              : 'translateX(0)',
            transition: 'opacity 0.32s ease, transform 0.32s ease',
          }}
        >
          {visibleItems.map(product => {
            const img    = product?.imgs?.[0] || product?.img || '';
            const name   = product?.name   || '';
            const rating = product?.rating || 0;
            const price  = product?.price  || 0;

            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                state={{ product }}
                className={styles.card}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.imageBox}>
                  {img ? (
                    <img
                      src={img}
                      alt={name}
                      className={styles.image}
                      loading="lazy"
                      onError={e => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <span className={styles.placeholder}>📦</span>
                  )}
                  <div className={styles.badge}>Viewed</div>
                </div>

                <div className={styles.info}>
                  <p className={styles.collection}>{product?.collection || ''}</p>
                  <p className={styles.name}>{name}</p>
                  <div className={styles.ratingRow}>
                    <span className={styles.stars}>{starsStr(rating)}</span>
                    <span className={styles.rating}>{rating}</span>
                  </div>
                  <span className={styles.price}>{fmt(price)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </section>
  );
}

export default memo(RecentlyViewed);