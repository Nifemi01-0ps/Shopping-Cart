import { create } from 'zustand';
import { coupons, products as staticProducts, fetchDummyProducts } from '../data/products.js';
import { getCartTotal } from '../utils/index.js';

const load = (key, def) => {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
};
const save = (key, val) => {
  try { sessionStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// Pre-normalize a single product for fast search lookups
const normalize = (product) => ({
  ...product,
  nameLower:       product.name?.toLowerCase() ?? '',
  tagsLower:       product.tags?.map(t => t.toLowerCase()) ?? [],
  collectionLower: product.collection?.toLowerCase() ?? '',
  descLower:       product.desc?.toLowerCase() ?? '',
});

// Normalize an entire product list
const normalizeAll = (list) => list.map(normalize);

export const useStore = create((set, get) => ({

  // ── PRODUCTS ────────────────────────────────────────────────────────────────
  products:        normalizeAll(staticProducts),
  productsLoading: false,
  productsError:   null,

  loadProducts: async () => {
    if (get().productsLoading) return;
    set({ productsLoading: true, productsError: null });
    try {
      const live = await fetchDummyProducts();
      set({ products: normalizeAll(live), productsLoading: false });
    } catch (err) {
      console.warn('[ShopFlow] loadProducts error:', err.message);
      set({ productsLoading: false, productsError: err.message });
    }
  },

  // ── CART ────────────────────────────────────────────────────────────────────
  cart: load('cart', []),

  addToCart: (product, qty = 1, size = null, color = null) => {
    const cart = get().cart;
    const key  = `${product.id}-${size}-${color}`;
    const ex   = cart.find(i => i.key === key);
    const next = ex
      ? cart.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i)
      : [...cart, { ...product, qty, size, color, key }];
    save('cart', next);
    set({ cart: next });
  },

  removeFromCart: (key) => {
    const next = get().cart.filter(i => i.key !== key);
    save('cart', next);
    set({ cart: next });
  },

  updateQty: (key, qty) => {
    if (qty <= 0) { get().removeFromCart(key); return; }
    const next = get().cart.map(i => i.key === key ? { ...i, qty } : i);
    save('cart', next);
    set({ cart: next });
  },

  clearCart: () => { save('cart', []); set({ cart: [] }); },

  // ── COUPON ──────────────────────────────────────────────────────────────────
  coupon:         null,
  couponDiscount: 0,

  applyCoupon: (code) => {
    const pct = coupons[code.toUpperCase()];
    if (!pct) return false;
    const discount = Math.round(getCartTotal(get().cart) * pct / 100);
    set({ coupon: code.toUpperCase(), couponDiscount: discount });
    return true;
  },

  removeCoupon: () => set({ coupon: null, couponDiscount: 0 }),

  // ── WISHLIST ─────────────────────────────────────────────────────────────────
  wishlist: load('wishlist', []),

  toggleWishlist: (product) => {
    const wl   = get().wishlist;
    const next = wl.find(i => i.id === product.id)
      ? wl.filter(i => i.id !== product.id)
      : [...wl, product];
    save('wishlist', next);
    set({ wishlist: next });
  },

  // ── RECENTLY VIEWED ──────────────────────────────────────────────────────────
  recentlyViewed: load('recentlyViewed', []),

  addRecentlyViewed: (product) => {
    const rv   = get().recentlyViewed.filter(i => i.id !== product.id);
    const next = [product, ...rv].slice(0, 8);
    save('recentlyViewed', next);
    set({ recentlyViewed: next });
  },

  // ── USER & ORDERS ────────────────────────────────────────────────────────────
  user:   load('user', null),
  orders: load('orders', []),

  login: (name, email) => {
    const user = { name, email, joined: new Date().toLocaleDateString() };
    save('user', user);
    set({ user });
  },

  logout: () => { save('user', null); set({ user: null }); },

  placeOrder: (orderData) => {
    const order = {
      id:     `ORD${Date.now()}`,
      date:   new Date().toLocaleDateString(),
      status: 'Processing',
      ...orderData,
    };
    const orders = [order, ...get().orders];
    save('orders', orders);
    set({ orders });
    get().clearCart();
    set({ coupon: null, couponDiscount: 0 });
    return order;
  },

  // ── UI STATE ─────────────────────────────────────────────────────────────────
  cartOpen:    false,
  setCartOpen: (v) => set({ cartOpen: v }),

  toast: null,
  showToast: (msg, type = 'success') => {
    set({ toast: { msg, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), 2800);
  },

  searchQuery:    '',
  setSearchQuery: (v) => set({ searchQuery: v }),
}));