import { getMinPrice, getTotalStock } from "../lib/productService";

export default function ProductListItem({ product, formatPrice, onViewProduct }) {
  const minPrice = getMinPrice(product);
  const totalStock = getTotalStock(product);
  const variantCount = product.product_variants?.length || 0;

  const stockTone =
    totalStock > 0
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-red-500/15 text-red-300";
  const stockLabel = totalStock > 0 ? `In stock (${totalStock})` : "Out of stock";

  return (
    <article
      onClick={() => onViewProduct(product.product_id)}
      className="group cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-slate-100 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-glow"
    >
      {/* Model preview area */}
      <div className="flex h-44 items-center justify-center bg-white p-4">
        <img
          src={(product.images || "") || `/images/${product.product_id}.jpg`}
          alt={product.name}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
        />
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockTone}`}>
            {stockLabel}
          </span>
          {variantCount > 1 ? (
            <span className="rounded-full bg-fibo-blue/15 px-3 py-1 text-xs font-semibold text-blue-300">
              {variantCount} variants
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-lg font-semibold text-slate-900 transition group-hover:text-fibo-blue">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {variantCount > 1 ? "From" : "Price"}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{formatPrice(minPrice)}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product.product_id);
            }}
            className="rounded-full bg-fibo-orange px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
