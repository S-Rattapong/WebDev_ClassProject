import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (cartItem, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.variant_id === cartItem.variant_id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.variant_id === cartItem.variant_id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...cartItem, quantity }] };
    }),
  removeFromCart: (variantId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.variant_id !== variantId),
    })),
  updateCartQuantity: (variantId, nextQuantity) =>
    set((state) => {
      if (nextQuantity <= 0) {
        return { cart: state.cart.filter((item) => item.variant_id !== variantId) };
      }
      return {
        cart: state.cart.map((item) =>
          item.variant_id === variantId ? { ...item, quantity: nextQuantity } : item
        ),
      };
    }),
  clearCart: () => set({ cart: [] }),
}));
