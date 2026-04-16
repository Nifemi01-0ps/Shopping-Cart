import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

const COLLECTIONS = [
    { label: 'Sneakers', path: '/shop?c=sneakers'  },
    { label: 'WristWatches', path: '/shop?c=wristwatches' },
    { label: "Men's Fashion", path: "/shop?c=men's fashion" },
    { label: "Women's Fashion", path: "/shop?c=women's fashion" },
    { label: 'Electronics', path: '/shop?c=electronics' },
    { label: 'Jewellery', path: '/shop?c=jewellery' },
    { label: 'Oriamo', path: '/shop?c=oriamo' },
    { label: 'Nivea', path: '/shop?c=nivea' },   
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.brand}>
                    <h3 className={styles.brandLogo}>
                        Shop<span className={styles.brandLogoEm}>Flow</span>
                    </h3>
                    <p className={styles.brandDesc}>
                        Your Curated destination for Fashion, electronics, jewellery and skincare products.
                    </p>
                </div>
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Collections</h4>
                    {COLLECTIONS.slice(0, 4).map(c => (
                        <Link key={c.label} to={c.path} className={styles.colLink}>{c.label}</Link>
                    ))}
                </div>

                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Help</h4>
                    <Link to="/track-order" className={styles.colLink}>Track Order</Link>
                    <Link to="/account" className={styles.colLink}>My Account</Link>
                    <Link to="/wishlist" className={styles.colLink}>My Wishlist</Link>
                    <Link to="/shop" className={styles.colLink}>All Products</Link>
                </div>

                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Company</h4>
                    <Link to="/" className={styles.colLink}>About us</Link>
                    <Link to="/" className={styles.colLink}>Blog</Link>
                    <Link to="/" className={styles.colLink}>Privacy Policy</Link>
                    <Link to="/" className={styles.colLink}>Terms of Service</Link>
                </div>
            </div>
            <div className={styles.bottom}>
                <p className={styles.bottomText}>© 2025 ShopFlow Nigeria. All rights reserved.</p>
                <p className={styles.bottomText}>Built with ♥ for Nigerian shoppers</p>
            </div>
        </footer>
    );
}