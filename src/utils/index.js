// Formatting
export const fmt = (price) => 
    '₦' + Math.round(price).toLocaleString('en-NG');
export const fmtCompact = (price) => {
    if (price >= 1_000_000) return '₦' + (price / 1_000_000).toFixed(1) + 'M';
    if (price >= 1_000) return '₦' + (price / 1_000).toFixed(0)
    return fmt(price);
}

// Star
export const starsStr = (rating) => 
    '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

// Discount 
export const discountPct = (price, OldPrice) => 
    OldPrice ? Math.round((1 - price / OldPrice) * 100) : 0;
export const savingsAmt = (price, OldPrice, qty = 1) => 
    OldPrice ? (OldPrice - price) * qty : 0;

// Cart helpers
export const getCartCount = (cart) => cart.reduce((s, i) => s + i.qty, 0);
export const getCartTotal = (cart) => cart.reduce((s, i) => s + i.price * i.qty, 0);
export const getCartSavings = (cart) => cart.reduce((s, i) => s + savingsAmt(i.price, i.oldPrice, i.qty), 0);
export const isWishlisted = (wishlist, id) => wishlist.some((i) => i.id === id);

// Strings
export const capitalise = (str) => 
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
export const truncate = (str, n = 100) => 
    str && str.length > n ? str.slice(0, n) + '…' : str;

//  Env 
export const ENV = {
    paystackKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    isDev: import.meta.env.DEV,
    appName: import.meta.env.VITE_APP_NAME
}