import { useMemo, useState } from "react";
import ProductListItem from "../components/ProductListItem";
import { useAppContext } from "../context/AppContext";
import { formatPrice } from "../data";
import { getMinPrice, getTotalStock } from "../lib/productService";

export default function ProductListPage({ onNavigateHome, onViewProduct, onNavigateLogin, currentPath }) {
  const { products, productsLoading } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => {
        const keyword = searchTerm.trim().toLowerCase();
        return (
          keyword.length === 0 ||
          product.name.toLowerCase().includes(keyword) ||
          (product.description || "").toLowerCase().includes(keyword)
        );
      })
      .sort((left, right) => {
        if (sortBy === "price-low") return getMinPrice(left) - getMinPrice(right);
        if (sortBy === "price-high") return getMinPrice(right) - getMinPrice(left);
        if (sortBy === "newest") return left.product_id > right.product_id ? -1 : 1;
        return 0;
      });
  }, [products, searchTerm, sortBy]);

  if (productsLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-fibo-blue"></div>
            <p className="mt-4 text-sm text-slate-400">Loading products…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <button onClick={onNavigateHome} className="transition hover:text-white">Home</button>
        <span>&gt;</span>
        <span className="text-white">All Products</span>
      </div>

      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Products</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">สินค้าทั้งหมด</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search products…"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-fibo-blue"
          />
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            {filteredProducts.length} products
          </div>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price low to high</option>
            <option value="price-high">Price high to low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <ProductListItem
              key={product.product_id}
              product={product}
              formatPrice={formatPrice}
              onViewProduct={onViewProduct}
            />
          ))
        ) : (
          <div className="col-span-full rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-400">
            No products found.
          </div>
        )}
      </div>
    </section>
  );
}
