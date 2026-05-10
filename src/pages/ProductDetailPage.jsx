import { useEffect, useMemo, useState } from "react";
import ModelViewer from "../components/ModelViewer";
import { useAppContext } from "../context/AppContext";
import { formatPrice } from "../data";
import {
  findVariantByAttributes,
  getAttributeKeys,
  getAttributeOptions,
  getConstrainedAttributeOptions,
} from "../lib/productService";

function AttributeSelector({ label, options, selectedValue, onSelect }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</h3>
        <span className="text-xs font-medium text-fibo-blue">{selectedValue || "—"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === selectedValue;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
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
  onNavigateLogin,
}) {
  const { addToCartWithAuth, products, productsLoading } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const product = useMemo(
    () => products.find((item) => String(item.product_id) === String(productId)),
    [products, productId],
  );

  const attributeKeys = useMemo(() => (product ? getAttributeKeys(product) : []), [product]);

  // Initialize selected attributes with first option of each key
  useEffect(() => {
    if (!product) return;
    setSelectedAttributes({});
    setQuantity(1);
  }, [product, attributeKeys]);

  const currentVariant = useMemo(() => {
    if (!product || Object.keys(selectedAttributes).length === 0) {
      return product?.product_variants?.[0] || null;
    }
    return findVariantByAttributes(product, selectedAttributes);
  }, [product, selectedAttributes]);

  if (productsLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-fibo-blue"></div>
            <p className="mt-4 text-sm text-slate-400">Loading product…</p>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-slate-400">
          Product not found.
        </div>
      </section>
    );
  }

  const stockLabel = currentVariant
    ? currentVariant.stock > 0
      ? `In stock (${currentVariant.stock})`
      : "Out of stock"
    : "No variants";
  const stockTone = currentVariant?.stock > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300";

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addToCartWithAuth(
      {
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        model: currentVariant.model,
        variant_id: currentVariant.variant_id,
        price: currentVariant.price,
        stock: currentVariant.stock,
        attributes: currentVariant.attributes,
      },
      quantity,
      currentPath,
      onNavigateLogin,
    );
  };

  const handleSelectAttribute = (key, value) => {
    setSelectedAttributes((current) => {
      const next = { ...current };
      if (current[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }

      return next;
    });
  };

  // ── Variant Selector Panel ──
  const selectorPanel = attributeKeys.length > 0 ? (
    <div className="space-y-4 rounded-[28px] border border-white/10 bg-slate-100 p-5 text-slate-900 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Specification Selector</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Configure this part</h2>
        </div>
        <button
          onClick={() => {
            setSelectedAttributes({});
          }}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-fibo-blue hover:text-fibo-blue"
        >
          Reset
        </button>
      </div>

      {attributeKeys.map((key) => (
        <AttributeSelector
          key={key}
          label={key.replace(/_/g, " ")}
          options={getConstrainedAttributeOptions(product, key, selectedAttributes)}
          selectedValue={selectedAttributes[key]}
          onSelect={(value) => handleSelectAttribute(key, value)}
        />
      ))}
    </div>
  ) : null;

  // ── 3D Model Panel (changes with variant) ──
  const modelPanel = currentVariant?.model ? (
    <ModelViewer modelUrl={currentVariant.model} />
  ) : (
    <div className="flex h-[380px] items-center justify-center rounded-[28px] border border-white/10 bg-slate-100 shadow-soft md:h-[460px]">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 text-3xl font-bold tracking-[0.24em] text-white shadow-panel">
        3D
      </div>
    </div>
  );

  // ── Detail Panel ──
  const detailPanel = (
    <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-100 p-6 text-slate-900 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockTone}`}>
          {stockLabel}
        </span>
        {(product.product_variants?.length || 0) > 1 ? (
          <span className="rounded-full bg-fibo-blue/15 px-3 py-1 text-xs font-semibold text-fibo-blue">
            {product.product_variants.length} variants
          </span>
        ) : null}
      </div>

      <div>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
      </div>

      {/* Current variant attributes */}
      {currentVariant?.attributes ? (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Selected Spec</p>
          <div className="grid gap-2 text-sm">
            {Object.entries(currentVariant.attributes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-600">{key.replace(/_/g, " ")}</span>
                <span className="font-medium text-slate-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Price & variant info */}
      <div className="rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Price</p>
            <p className="mt-2 text-3xl font-semibold">
              {currentVariant ? formatPrice(currentVariant.price) : "—"}
            </p>
          </div>
          {currentVariant ? (
            <div className="rounded-3xl bg-slate-900 px-4 py-3 text-center text-xs font-semibold text-white">
              Variant: {String(currentVariant.variant_id).slice(0, 8)}…
            </div>
          ) : null}
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Stock</span>
            <span className="font-medium text-slate-900">{currentVariant?.stock ?? 0} units</span>
          </div>
          {currentVariant?.model ? (
            <div className="flex items-center justify-between">
              <span>3D Model</span>
              <span className="font-medium text-emerald-600">Available</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Quantity & Add to cart */}
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center rounded-full border border-slate-300 bg-white">
          <button onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="px-4 py-2 text-slate-700">-</button>
          <span className="min-w-12 px-2 text-center text-sm font-semibold text-slate-900">{quantity}</span>
          <button onClick={() => setQuantity((v) => v + 1)} className="px-4 py-2 text-slate-700">+</button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!currentVariant || currentVariant.stock <= 0}
          className="rounded-full bg-fibo-orange px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
        >
          {currentVariant?.stock > 0 ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <button onClick={onNavigateHome} className="transition hover:text-white">Home</button>
        <span>&gt;</span>
        <button onClick={() => (window.location.hash = "/products")} className="transition hover:text-white">Products</button>
        <span>&gt;</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)_420px]">
        <div className="order-3 xl:order-1">{selectorPanel}</div>
        <div className="order-2 xl:order-2">{modelPanel}</div>
        <div className="order-1 xl:order-3">{detailPanel}</div>
      </div>
    </section>
  );
}
