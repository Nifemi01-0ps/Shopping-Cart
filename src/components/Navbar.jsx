import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { getCartCount } from "../utils/index.js";
import  ThemeToggle  from "../context/ThemeContext.jsx";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    const cart = useStore(st => st.cart);
    const cartOpen = useStore(st => st.cartOpen);
    const setCartOpen = useStore(st => st.setCartOpen);
    const user = useStore(st => st.user);
    const logout = useStore(st => st.logout);
    const wishlist = useStore(st => st.wishlist);
    const searchQuery = useStore(st => st.searchQuery);
    const setSearch = useStore(st => st.setSearchQuery);
    const showToast = useStore(st => st.showToast);

    const cartCount = getCartCount(cart);

    const [userOpen, setUserOpen] = useState(false);
    const dropRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = e => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setUserOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = e => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    };
    
    return (
        <nav className={styles.nav} role="banner">
            <Link to='/' className={styles.logo} aria-label="ShopFlow home">
                Shop<span className={styles.logoEm}>Flow</span>
            </Link>
            <form className={styles.searchForm} onSubmit={handleSearch} role="search">
                <div className={styles.searchBar}>
                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input type="text"
                        className={styles.searchInput}
                        placeholder="Search products ...."
                        value={searchQuery}
                        onChange={e => setSearch(e.target.value)}
                        aria-label="Search products"
                    />
                </div>
            </form>

            <div className={styles.right}>
                {/* Wishlist */}
                <Link to="/wishlist" className={styles.iconBtn} aria-label={`Wishlist (${wishlist.length} items)`}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {wishlist.length > 0 && (
                        <span className={styles.badge} aria-hidden='true'>{wishlist.length}</span>
                    )}

                    {/* Dark / Light toggle */}
                    <ThemeToggle>
                        {/* Account */}
                        <div ref={dropRef} style={{ position: 'relative' }}>
                            <button className={styles.iconBtn} onClick={() => setUserOpen(o => !o)} aria-label="Account menu" aria-expanded={userOpen} aria-haspopup='true'>
                                 <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </button>

                            {userOpen && (
                                <div className={styles.dropdown} role="menu">
                                    {user ? (
                                        <>
                                            <div className={`${styles.dropItem} ${styles.dropItemMuted}`} role="menuItem" aria-disabled='true'>
                                                Hi, {user.name.split(' ')[0]} 👋
                                            </div>
                                            <Link to='/account' className={styles.dropItem} role="menuitem" onClick={() => setUserOpen(false)}>My Orders</Link>
                                            <Link to='/account' className={styles.dropItem} role="menuitem" onClick={() => setUserOpen(false)}>Account Settings</Link>
                                            <button className={`${styles.dropItem} ${styles.dropItemDanger}`} role="menuitem" onClick={() => { logout(); showToast('Logged out successfully'); setUserOpen(false); }}>
                                                Log Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to='/login' className={styles.dropItem} role="menuitem" onClick={() => setUserOpen(false)}>Log In</Link>
                                            <Link to='/login?signup=1' className={styles.dropItem} role="menuitem" onClick={() => setUserOpen(false)}>Create Account</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <button className={styles.cartBtn} onClick={() => setCartOpen(!cartOpen)} aria-label={`Open cart, ${cartCount} items`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                          Cart
                          <span className={styles.cartCount} aria-hidden='true'>{cartCount}</span>  
                        </button>
                    </ThemeToggle>
                </Link>
            </div>
        </nav>
    );
}