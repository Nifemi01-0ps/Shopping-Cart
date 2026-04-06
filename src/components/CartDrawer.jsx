import { useState } from "react";
import { Link } from "react-router";
import { useStore } from "module";
import { getCartTotal, getCartSaving } from "module";
import styles from "../styles/CartDrawer.module.css";
const fmt = p => '₦' + p.toLocaleString('en-NG');
export default function CartDrawer() {
    const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, coupon, couponDiscount, applyCoupon, removeCoupon, showToast } = useState();
    const cartTotal = getCartTotal(cart);
    const finalTotal = cartTotal - couponDiscount;
    const [couponInput, setCouponInput] = useState('');
    const handleCoupon = () => {
        if (!couponInput.trim()) return;
        const ok = applyCoupon(couponInput);
        if (ok) {
            showToast('Coupon applied! 🎉')
        } else {
            showToast('Invalid coupon code', 'error');
        }
        setCouponInput('');
    };
    return (
        <>
            {cartOpen, && <div className={styles.overlay} onClick={() => setCartOpen(false)} />}
            <div className={`${styles.drawer} ${cartOpen ? styles.drawerOpen : styles.drawerClosed}`}>
                <div className={styles.header}>
                    <div>
                        <h2>Your Cart</h2>
                        {cart.length > 0 && <p className={styles.itemCount}>{cart.reduce((s, i) => s + i.qty, 0)} items</p>}
                    </div>
                    <button onClick={() => setCartOpen(false)} className={styles.closeBtn}>✕</button>
                </div>
                <div className={styles.itemList}>
                    {cart.map(item => (
                        <div key={item.key} className={styles.cartItem}>
                            {/*...item content ... */}
                            <div className={styles.qtyControls}>
                                <button onClick={() => updateQty(item.key, item.qty - 1)} className={styles.qtyBtn}>-</button>
                                <span>{item.qty}</span>
                                <button onClick={() => updateQty(item.key, item.qty + 1)} className={styles.qtyBtn}>+</button>
                            </div>
                        </div>  
                    ))}
                </div>
                {cart.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.couponInputWrapper}>
                            <input className={styles.couponInput} value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Promo code" />
                            <button onClick={handleCoupon} className={styles.applyBtn}>Apply</button>
                        </div>
                        {/* ... totals ... */}
                    </div>
                )}
            </div>
        </>
    )
}

