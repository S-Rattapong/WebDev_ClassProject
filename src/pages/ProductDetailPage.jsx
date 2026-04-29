import { useEffect, useMemo, useState } from "react";
import ModelViewer from "../components/ModelViewer";
import { useAppContext } from "../context/AppContext";
import { categories, findVariant, formatPrice, products } from "../data";

function DetailBadge({ children, tone }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{children}</span>;
}

function SelectorGroup({ selector, selectedValue, onSelect }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{selector.label}</h3>
        <span className="text-xs font-medium text-fibo-blue">{selectedValue}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {selector.options.map((option) => {
          const isActive = option === selectedValue;

          return (
            <button
              key={option}
              onClick={() => onSelect(selector.key, option)}
              className={
                isActive
                  ? "rounded-full bg-fibo-blue px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-fibo-blue hover:text-fibo-blue"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function ProductDetailPage({
  productId,
  currentPath,
  onNavigateHome,
  onNavigateCategory,
  onNavigateLogin,
}) {
  const { addToCartWithAuth } = useAppContext();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [productId],
  );

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (!product) return;

    const defaultOptions = Object.fromEntries(
      product.selectors.map((selector) => [selector.key, selector.options[0]]),
    );
    setSelectedOptions(defaultOptions);
    setQuantity(1);
  }, [product]);

  const currentVariant = useMemo(() => {
    if (!product || Object.keys(selectedOptions).length === 0) return null;
    return findVariant(product, selectedOptions);
  }, [product, selectedOptions]);

  if (!product || !currentVariant) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-400">
          Product not found.
        </div>
      </section>
    );
  }

  const category = categories.find((item) => item.id === product.categoryId);
  const stockTone =
    product.availability === "in-stock"
      ? "bg-emerald-500/15 text-emerald-300"
      : product.availability === "limited"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-sky-500/15 text-sky-300";

  const handleAddToCart = () => {
    addToCartWithAuth(
      {
        ...product,
        sku: currentVariant.sku,
        spec: currentVariant.spec,
        price: currentVariant.price,
        stock: currentVariant.stock,
      },
      quantity,
      currentPath,
      onNavigateLogin,
    );
  };

  const handleSelectOption = (key, value) => {
    setSelectedOptions((current) => ({ ...current, [key]: value }));
  };

  const specSelectorPanel = (
    <div className="space-y-4 rounded-[28px] border border-white/10 bg-slate-100 p-5 text-slate-900 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Specification Selector</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Configure this part</h2>
        </div>
        <button
          onClick={() =>
            setSelectedOptions(
              Object.fromEntries(product.selectors.map((selector) => [selector.key, selector.options[0]])),
            )
          }
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-fibo-blue hover:text-fibo-blue"
        >
          Reset
        </button>
      </div>

      {product.selectors.map((selector) => (
        <SelectorGroup
          key={selector.key}
          selector={selector}
          selectedValue={selectedOptions[selector.key]}
          onSelect={handleSelectOption}
        />
      ))}
    </div>
  );

  const modelPanel = (
    <ModelViewer
      shape={currentVariant.modelShape}
      color={currentVariant.modelColor}
      accent={currentVariant.modelAccent}
      scale={currentVariant.modelScale}
    />
  );

  const detailPanel = (
    <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-100 p-6 text-slate-900 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <DetailBadge tone="bg-slate-900 text-white">{product.brand}</DetailBadge>
        <DetailBadge tone={stockTone}>{currentVariant.stock}</DetailBadge>
        <DetailBadge tone="bg-orange-100 text-orange-700">{product.type}</DetailBadge>
      </div>

      <div>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{currentVariant.spec}</p>
      </div>

      <div className="rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Price</p>
            <p className="mt-2 text-3xl font-semibold">{formatPrice(currentVariant.price)}</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">
            SKU: {currentVariant.sku}
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Brand</span>
            <span className="font-medium text-slate-900">{product.brand}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Availability</span>
            <span className="font-medium text-slate-900">{currentVariant.stock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Category</span>
            <span className="font-medium text-slate-900">{category?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Variant note</span>
            <span className="max-w-[220px] text-right font-medium text-slate-900">{currentVariant.note}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center rounded-full border border-slate-300 bg-white">
          <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-2 text-slate-700">
            -
          </button>
          <span className="min-w-12 px-2 text-center text-sm font-semibold text-slate-900">{quantity}</span>
          <button onClick={() => setQuantity((value) => value + 1)} className="px-4 py-2 text-slate-700">
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="rounded-full bg-fibo-orange px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          Add to cart
        </button>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <button onClick={onNavigateHome} className="transition hover:text-white">
          Home
        </button>
        <span>&gt;</span>
        <button onClick={() => onNavigateCategory(product.categoryId)} className="transition hover:text-white">
          {category?.name || "Category"}
        </button>
        <span>&gt;</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)_420px]">
        <div className="order-3 xl:order-1">{specSelectorPanel}</div>
        <div className="order-2 xl:order-2">{modelPanel}</div>
        <div className="order-1 xl:order-3">{detailPanel}</div>
      </div>
    </section>
  );
}
