import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import ProductListItem from "../components/ProductListItem";
import SidebarFilter from "../components/SidebarFilter";
import { useAppContext } from "../context/AppContext";
import { categories, formatPrice, products } from "../data";

export default function ProductListPage({ categoryId, currentPath, onNavigateHome, onViewProduct, onNavigateLogin }) {
  const { addToCartWithAuth } = useAppContext();
  const category = categories.find((item) => item.id === categoryId) || categories[0];
  const categoryProducts = useMemo(
    () => products.filter((product) => product.categoryId === category.id),
    [category.id],
  );
  const brands = useMemo(() => [...new Set(categoryProducts.map((product) => product.brand))], [categoryProducts]);
  const types = useMemo(() => [...new Set(categoryProducts.map((product) => product.type))], [categoryProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setSearchTerm("");
    setSelectedBrand("all");
    setSelectedType("all");
    setSelectedAvailability("all");
    setMaxPrice(6000);
    setSortBy("popular");
  }, [category.id]);

  const filteredProducts = useMemo(() => {
    return [...categoryProducts]
      .filter((product) => {
        const keyword = searchTerm.trim().toLowerCase();
        const matchesSearch =
          keyword.length === 0 ||
          product.name.toLowerCase().includes(keyword) ||
          product.sku.toLowerCase().includes(keyword) ||
          product.spec.toLowerCase().includes(keyword);
        const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
        const matchesType = selectedType === "all" || product.type === selectedType;
        const matchesAvailability = selectedAvailability === "all" || product.availability === selectedAvailability;
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesBrand && matchesType && matchesAvailability && matchesPrice;
      })
      .sort((left, right) => {
        if (sortBy === "price-low") return left.price - right.price;
        if (sortBy === "price-high") return right.price - left.price;
        if (sortBy === "newest") return right.id.localeCompare(left.id);
        return 0;
      });
  }, [categoryProducts, maxPrice, searchTerm, selectedAvailability, selectedBrand, selectedType, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
      <Breadcrumb categoryName={category.name} onNavigateHome={onNavigateHome} />

      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Category detail</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{category.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{category.description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <SidebarFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          brands={brands}
          types={types}
          formatPrice={formatPrice}
        />

        <div className="space-y-5">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                formatPrice={formatPrice}
                onViewProduct={onViewProduct}
                onAddToCart={(quantity) => addToCartWithAuth(product, quantity, currentPath, onNavigateLogin)}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-400">
              No products matched the selected filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
