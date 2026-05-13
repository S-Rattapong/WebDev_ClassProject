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
  const [userProfile, setUserProfile] = useState(null);

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

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user?.email) {
        setUserProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("USER")
          .select("name, email, address")
          .eq("email", session.user.email)
          .maybeSingle();

        if (error) throw error;
        setUserProfile(data || null);
      } catch (err) {
        console.error("Failed to load user profile:", err.message);
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [session?.user?.email]);

  // ── Derived state ──
  const isLoggedIn = !!session;
  const currentUser = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        username: userProfile?.name || session.user.user_metadata?.username || "",
        address: userProfile?.address || "",
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

  const updateUserProfile = async ({ name, address }) => {
    if (!session?.user?.email) {
      throw new Error("Please login before updating profile.");
    }

    const email = session.user.email;
    const payload = {
      name: name.trim(),
      address: (address || "").trim(),
    };

    const { data: updatedRow, error: updateError } = await supabase
      .from("USER")
      .update(payload)
      .eq("email", email)
      .select("name, email, address")
      .maybeSingle();

    if (updateError) throw updateError;

    let profile = updatedRow;

    if (!profile) {
      const { data: insertedRow, error: insertError } = await supabase
        .from("USER")
        .insert({
          email,
          ...payload,
        })
        .select("name, email, address")
        .single();

      if (insertError) throw insertError;
      profile = insertedRow;
    }

    setUserProfile(profile);
    return profile;
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
      updateUserProfile,
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
