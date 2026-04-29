import { useState } from "react";

export default function ProductListItem({ product, formatPrice, onViewProduct, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const stockClass =
    product.availability === "in-stock"
      ? "bg-emerald-500/15 text-emerald-300"
      : product.availability === "limited"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-sky-500/15 text-sky-300";

  return (
    <article
      onClick={() => onViewProduct(product.id)}
      className="cursor-pointer rounded-[28px] border border-white/10 bg-slate-100 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-orange-200 via-white to-slate-200 lg:w-44">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 text-lg font-bold tracking-[0.24em] text-white shadow-panel">
            {product.image}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {product.brand}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockClass}`}>
                  {product.stock}
                </span>
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onViewProduct(product.id);
                }}
                className="mt-3 text-left text-xl font-semibold text-slate-900 transition hover:text-fibo-blue"
              >
                {product.name}
              </button>
              <p className="mt-2 text-sm leading-7 text-slate-600">{product.spec}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>SKU: {product.sku}</span>
                <span>Type: {product.type}</span>
              </div>
            </div>

            <div className="xl:text-right">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Price</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{formatPrice(product.price)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-white">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setQuantity((value) => Math.max(1, value - 1));
                }}
                className="px-4 py-2 text-slate-700"
              >
                -
              </button>
              <span className="min-w-12 px-2 text-center text-sm font-semibold text-slate-900">{quantity}</span>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setQuantity((value) => value + 1);
                }}
                className="px-4 py-2 text-slate-700"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onViewProduct(product.id);
                }}
                className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                Details
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onAddToCart(quantity);
                }}
                className="rounded-full bg-fibo-orange px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
