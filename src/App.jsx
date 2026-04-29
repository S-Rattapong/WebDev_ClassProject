import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "./context/AppContext";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import RegisterPage from "./pages/RegisterPage";

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const categoryMatch = hash.match(/^\/categories\/([^/]+)$/);
  const productMatch = hash.match(/^\/products\/([^/]+)$/);

  if (categoryMatch) {
    return {
      path: "/categories/:categoryId",
      categoryId: categoryMatch[1],
      productId: null,
    };
  }

  if (productMatch) {
    return {
      path: "/products/:productId",
      categoryId: null,
      productId: productMatch[1],
    };
  }

  return {
    path: hash,
    categoryId: null,
    productId: null,
  };
}

function navigateTo(path) {
  window.location.hash = path;
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash());
  const { cart, isLoggedIn, logout } = useAppContext();

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
    if (route.path === "/categories/:categoryId") return `/categories/${route.categoryId}`;
    if (route.path === "/products/:productId") return `/products/${route.productId}`;
    return route.path || "/";
  }, [route]);

  const shouldShowHero = route.path === "/";

  const renderPage = () => {
    if (route.path === "/") {
      return <CategoryPage onSelectCategory={(categoryId) => navigateTo(`/categories/${categoryId}`)} />;
    }

    if (route.path === "/categories/:categoryId") {
      return (
        <ProductListPage
          categoryId={route.categoryId}
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
          onNavigateCategory={(categoryId) => navigateTo(`/categories/${categoryId}`)}
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

    return <CategoryPage onSelectCategory={(categoryId) => navigateTo(`/categories/${categoryId}`)} />;
  };

  return (
    <div className="min-h-screen bg-fibo text-white">
      <Header
        onNavigateHome={() => navigateTo("/")}
        onNavigateLogin={() => navigateTo("/login")}
        onNavigateRegister={() => navigateTo("/register")}
        onNavigateCart={() => navigateTo("/cart")}
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        onLogout={logout}
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
