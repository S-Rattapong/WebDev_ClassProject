import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useCartStore } from "./store/cartStore";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import PackageStatusPage from "./pages/PackageStatusPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const productMatch = hash.match(/^\/products\/([^/]+)$/);

  if (productMatch) {
    return {
      path: "/products/:productId",
      productId: productMatch[1],
    };
  }

  return {
    path: hash,
    productId: null,
  };
}

function navigateTo(path) {
  window.location.hash = path;
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash());
  const { currentUser, isLoggedIn, isLoading, logout } = useAppContext();
  const cart = useCartStore((state) => state.cart);

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const currentPath = useMemo(() => {
    if (route.path === "/products/:productId") return `/products/${route.productId}`;
    return route.path || "/";
  }, [route]);

  const isHomeOrProductsPage = route.path === "/" || route.path === "/products";
  const shouldShowHero = isHomeOrProductsPage;

  const renderPage = () => {
    if (route.path === "/" || route.path === "/products") {
      return (
        <ProductListPage
          currentPath={currentPath}
          onNavigateHome={() => navigateTo("/")}
          onViewProduct={(productId) => navigateTo(`/products/${productId}`)}
          onNavigateLogin={() => navigateTo("/login")}
        />
      );
    }

    if (route.path === "/products/:productId") {
      return (
        <ProductDetailPage
          productId={route.productId}
          currentPath={currentPath}
          onNavigateHome={() => navigateTo("/")}
          onNavigateLogin={() => navigateTo("/login")}
        />
      );
    }

    if (route.path === "/cart") {
      return (
        <CartPage
          onNavigateHome={() => navigateTo("/")}
          onViewProduct={(productId) => navigateTo(`/products/${productId}`)}
        />
      );
    }

    if (route.path === "/login") {
      return <LoginPage onNavigateRegister={() => navigateTo("/register")} onNavigateHome={() => navigateTo("/")} />;
    }

    if (route.path === "/register") {
      return <RegisterPage onNavigateLogin={() => navigateTo("/login")} onNavigateHome={() => navigateTo("/")} />;
    }

    if (route.path === "/profile") {
      if (!isLoggedIn) {
        navigateTo("/login");
        return null;
      }
      return <ProfilePage />;
    }

    if (route.path === "/package-status") {
      if (!isLoggedIn) {
        navigateTo("/login");
        return null;
      }
      return <PackageStatusPage />;
    }

    return (
      <ProductListPage
        currentPath={currentPath}
        onNavigateHome={() => navigateTo("/")}
        onViewProduct={(productId) => navigateTo(`/products/${productId}`)}
        onNavigateLogin={() => navigateTo("/login")}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-fibo text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-fibo-blue"></div>
          <p className="mt-4 text-sm text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fibo text-white">
      <Header
        onNavigateHome={() => navigateTo("/")}
        onNavigateLogin={() => navigateTo("/login")}
        onNavigateRegister={() => navigateTo("/register")}
        onNavigateCart={() => navigateTo("/cart")}
        onNavigateProfile={() => navigateTo("/profile")}
        onNavigatePackageStatus={() => navigateTo("/package-status")}
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="min-h-[calc(100vh-180px)] bg-fibo">
        <div className="bg-fibo">
          {shouldShowHero ? <HeroSection /> : null}
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
