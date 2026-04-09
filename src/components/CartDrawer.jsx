import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { getCartTotal, getCartSavings } from "../utils/index.js";
import styles from "../styles/CartDrawer.module.css";

const fmt = p => '₦' + p.toLocalString('en-NG');

export default function CartDrawer() {
  const cart = useStore(st => st.cart);
  const cartOpen = useStore(st => st.cartOpen);
  const setCartOpen = useStore(st => st.setCartOpen);
  const updateQty = useStore(st => st.updateQty);
  const removeFromCart = useStore(st => st.removeFromCart);
  const coupon = useStore(st => st.coupon);
  const couponDiscount = useStore(st => st.couponDiscount);
  const applyCoupon = useStore(st => st.applyCoupon);
  const removeCoupon = useState(st => st.removeCoupon);
  const showToast = useState(st => st.showToast);

  const cartTotal = getCartTotal(cart);
  const cartSaving = getCartSavings(cart);
  const finalTotal = cartTotal - couponDiscount;

  // Use State
  const [couponInput, setCouponInput] = useState('');

  // Handle Coupon Function
  const handleCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) showToast('Coupon applied! 🎉');
    else showToast('Invalid coupon code', 'error');
    setCouponInput('');
  }
  return (
    <>
      {cartOpen && (
        <div data-testid='overlay' className={styles.overlay} onClick={() => setCartOpen(false)}/>
      )}
      <div className={styles.drawer} style={{ right: cartOpen ? 0: '-480px' }}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Your Cart</h2>
            {cart.length > 0 && (
              <p className={styles.itemCount}>
                {cart.reduce((s, i) => s + i.qty, 0)} items
              </p>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className={styles.closeBtn}>✕</button>
        </div>
        {/* Items */}
        <div className={styles.items}>
            {cart.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Your Cart is empty</p>
                <Link to="/shop" onClick={() => setCartOpen(false)} className={styles.browseBtn}>Browse Products</Link>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.key} className={styles.cartItem}>
                  <div className={styles.imgBox}>
                    <img src={item.img} alt={item.name} />
                  </div>

                  <div>
                    <p className={styles.itemName}>{item.name}</p>
                    <div className={styles.qtyControls}>
                      <button onClick={() => updateQty(item.key, item.qty - 1)} className={styles.qtyBtn}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.key, item.qty + 1)} className={styles.qtyBtn}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.priceBox}>
                    <p>{fmt(item.price * item.qty)}</p>
                    <button onClick={() => removeFromCart(item.key)} className={styles.removeBtn}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
        </div>
        {/* Footer */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.couponRow}>
              <input type="text" data-testid='coupon-input' value={couponInput} className={styles.input} />
              <button data-testid='apply-coupon' onClick={handleCoupon} className={styles.applyBtn}>
                Apply
              </button>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{fmt(finalTotal)}</span>
            </div>
            <Link to="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout →
            </Link>
            <p>Codes: SAVE10 . WELCOME20 . FLASH15</p>
          </div>
        )}
      </div>
    </>
  );
}