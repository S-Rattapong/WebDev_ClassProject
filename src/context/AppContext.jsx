import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchProducts } from "../lib/productService";
import { useCartStore } from "../store/cartStore";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authRedirectPath, setAuthRedirectPath] = useState("/");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // ── Listen to Supabase auth state changes ──
  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    // Subscribe to auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load products from Supabase ──
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ── Derived state ──
  const isLoggedIn = !!session;
  const currentUser = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        username: session.user.user_metadata?.username || session.user.email,
      }
    : null;

  // ── Auth actions ──
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const register = async ({ username, email, password, address }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) throw error;

    // Insert into USER table
    if (data?.user) {
      const { error: insertError } = await supabase.from("USER").insert({
        name: username,
        email: email,
        address: address || "",
      });

      if (insertError) throw insertError;
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useCartStore.getState().clearCart();
    setAuthRedirectPath("/");
  };

  const addToCartWithAuth = (cartItem, quantity, currentPath, onNavigateLogin) => {
    if (!isLoggedIn) {
      alert("Please login first to add items to your cart.");
      setAuthRedirectPath(currentPath || "/");
      onNavigateLogin();
      return false;
    }

    useCartStore.getState().addToCart(cartItem, quantity);
    return true;
  };

  const value = useMemo(
    () => ({
      addToCartWithAuth,
      authRedirectPath,
      currentUser,
      isLoading,
      isLoggedIn,
      login,
      logout,
      products,
      productsLoading,
      refreshProducts: loadProducts,
      register,
      session,
      setAuthRedirectPath,
    }),
    [authRedirectPath, currentUser, isLoading, isLoggedIn, products, productsLoading, session],
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
