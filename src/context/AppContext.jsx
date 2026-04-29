import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [authRedirectPath, setAuthRedirectPath] = useState("/");
  const [currentUser, setCurrentUser] = useState(null);

  const login = ({ email }) => {
    setIsLoggedIn(true);
    setCurrentUser({ email });
  };

  const register = ({ username, email }) => ({ username, email });

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
    setAuthRedirectPath("/");
  };

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [...currentCart, { ...product, quantity }];
    });
  };

  const addToCartWithAuth = (product, quantity, currentPath, onNavigateLogin) => {
    if (!isLoggedIn) {
      alert("Please login first to add items to your cart.");
      setAuthRedirectPath(currentPath || "/");
      onNavigateLogin();
      return false;
    }

    addToCart(product, quantity);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, nextQuantity) => {
    if (nextQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  const value = useMemo(
    () => ({
      addToCart,
      addToCartWithAuth,
      authRedirectPath,
      cart,
      currentUser,
      isLoggedIn,
      login,
      logout,
      register,
      removeFromCart,
      setAuthRedirectPath,
      updateCartQuantity,
    }),
    [authRedirectPath, cart, currentUser, isLoggedIn],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return value;
}
