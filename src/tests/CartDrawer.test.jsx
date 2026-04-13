import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import CartDrawer from "../components/CartDrawer.jsx";
import { useStore } from "../store/useStore.js";
import { coupons } from "../data/products.js";
import userEvent from "@testing-library/user-event";

// Mocking Zustand store 
vi.mock('../store/useStore.js', () => ({
  useStore: vi.fn()
}));

function mockStore(state) {
  const defaults = {
    cart: [],
    cartOpen: true,
    setCartOpen: vi.fn(),
    updateQty: vi.fn(),
    removeFromCart: vi.fn(),
    applyCoupon: vi.fn(() => false),
    removeCoupon: vi.fn(),
    showToast: vi.fn(),
    coupon: null,
    couponDiscount: 0
  };
  const merged = { ...defaults, ...state };
  useStore.mockImplementation(selector => selector(merged));
}

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('renders "empty" message when cart is empty', () => {
    mockStore({
      cart: [],
      cartOpen: true
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
  test('updates quantity when plus button is clicked', async() => {
    const user = userEvent.setup();
    const updateQty = vi.fn();
    mockStore({
      cart: [{ key: '1', name: 'Item', price: 100, qty: 1 }],
      cartOpen: true,
      updateQty,
      setCartOpen: vi.fn(),
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    await user.click(screen.getByText('+'))
    expect(updateQty).toHaveBeenCalledWith('1', 2);
  });
  test('updates quantity when minus button is clicked', () => {
    const updateQty = vi.fn();
    mockStore({
      cart: [{ key: 2, name: 'Item', price: 200, qty: 5 }],
      cartOpen: true,
      updateQty,
      setCartOpen: vi.fn(),
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    fireEvent.click(screen.getByText('−'));
    expect(updateQty).toHaveBeenCalledWith(2, 4);
  });
  test('render cart items correctly', () => {
    mockStore({
      cart: [{ key: 1, name: 'Item A', price: 100, qty: 2 }],
      cartOpen: true,
      setCartOpen: vi.fn(),
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('₦200')).toHaveLength(2);
  })
  test('closes drawer when close button is clicked', () => {
    const setCartOpen = vi.fn();
    mockStore({
      cart: [],
      cartOpen: true,
      setCartOpen,
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    fireEvent.click(screen.getByText('✕'));
    expect(setCartOpen).toHaveBeenCalledWith(false)
  });
  test('removes item when remove button is clicked', async() => {
    const user = userEvent.setup();
    const removeFromCart = vi.fn();

    mockStore({
      cart: [{ key: 3, name: 'Item B', price: 300, qty: 1 }],
      cartOpen: true,
      removeFromCart,
      setCartOpen: vi.fn(),
    });

    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    await user.click(screen.getByText(/remove/i));

    expect(removeFromCart).toHaveBeenCalledWith(3);
  });
  test('clicking overlay closes cart', async() => {
    const user = userEvent.setup();
    const setCartOpen = vi.fn();
    mockStore({
      cart: [],
      cartOpen: true,
      setCartOpen,
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    const overlay = screen.getByTestId('overlay');
    await user.click(overlay);
    expect(setCartOpen).toHaveBeenCalledWith(false);
  })
  test('applies coupon successfully', async() => {
    const user = userEvent.setup();
    const applyCoupon = vi.fn(() => true);
    const showToast = vi.fn();
    mockStore({
      cart: [{ key: 1, name: 'Item', price: 100, qty: 1 }],
      cartOpen: true,
      applyCoupon,
      showToast,
      setCartOpen: vi.fn(),
      couponDiscount: 0,
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    await user.type(screen.getByTestId('coupon-input'), 'SAVE10')
    await user.click(screen.getByTestId('apply-coupon'));
    expect(applyCoupon).toHaveBeenCalledWith('SAVE10');
    expect(showToast).toHaveBeenCalledWith('Coupon applied! 🎉');
  });
  test('show error for invalid coupon', async() => {
    const user = userEvent.setup();
    const applyCoupon = vi.fn(() => false);
    const showToast = vi.fn();
    mockStore({
      cart: [{ key: 1, name: 'Item', price: 100, qty: 1 }],
      cartOpen: true,
      applyCoupon,
      showToast,
      setCartOpen: vi.fn(),
      couponDiscount: 0
    })
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    await user.type(screen.getByTestId('coupon-input'), 'BADCODE');
    await user.click(screen.getByTestId('apply-coupon'));
    expect(applyCoupon).toHaveBeenCalledWith('BADCODE');
    expect(showToast).toHaveBeenCalledWith('Invalid coupon code', 'error');
  });
  test('test empty input', async() => {
    const user = userEvent.setup();
     const applyCoupon = vi.fn(() => true); 
     const showToast = vi.fn();
     mockStore({
        cart: [{ key: 1, name: 'Item', price: 100, qty: 1 }],
        cartOpen: true,
        applyCoupon,
        showToast,
        setCartOpen: vi.fn(),
        couponDiscount: 0
      });
      render(<MemoryRouter><CartDrawer /></MemoryRouter>);
      await user.click(screen.getByTestId('apply-coupon'));
      expect(applyCoupon).not.toHaveBeenCalledWith();
      expect(showToast).not.toHaveBeenCalledWith();
    })
   test('calculates total correctly', () => {
    mockStore({
      cart: [{ key: 1, name: 'Item', price: 100, qty: 2 }],
      couponDiscount: 50
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    expect(screen.getByText((text) => text.includes('₦') && text.includes('150'))).toBeInTheDocument();
   })
   test('does not decrease quantity below 1', async() => {
    const user = userEvent.setup();
    const updateQty = vi.fn();
    mockStore({
      cart: [{ key: 1, name: 'Item', price: 100, qty: 1 }],
      updateQty
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    await user.click(screen.getByText('−'));
    expect(updateQty).not.toHaveBeenCalled();
   })
   test('applies coupon when Enter key is pressed', async() => {
    const user = userEvent.setup();
    const applyCoupon = vi.fn(() => true);
    const showToast = vi.fn();
    mockStore({
      cart: [{ key: 1, name: 'Ítem',  price: 100, qty: 1 }],
      applyCoupon,
      showToast
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    const input = screen.getByTestId('coupon-input');
    await user.type(input, 'SAVE10{enter}');
    expect(applyCoupon).toHaveBeenLastCalledWith('SAVE10');
   })
   test('does not apply coupon when input is empty', async () => {
    const user = userEvent.setup();
    const applyCoupon = vi.fn();
    const showToast = vi.fn();
    mockStore({
      cart: [{ key: 1, name: 'Item', price: 100, qty: 1 }],
      showToast,
      applyCoupon
    });
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    await user.click(screen.getByTestId('apply-coupon'));
    expect(applyCoupon).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
   })
})