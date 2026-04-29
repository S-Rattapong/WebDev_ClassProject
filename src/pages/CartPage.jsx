import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { formatPrice } from "../data";

export default function CartPage({ onNavigateHome, onViewProduct }) {
  const { cart, removeFromCart, updateCartQuantity } = useAppContext();

  const totalAmount = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  if (!cart.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="rounded-[28px] border border-white/10 bg-slate-100 px-6 py-12 text-center text-slate-900 shadow-soft">
          <h1 className="text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Start from the category page and add the parts you want to compare or order later.
          </p>
          <button
            onClick={onNavigateHome}
            className="mt-6 rounded-full bg-fibo-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Cart</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Selected products</h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
          {cart.length} line items
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {cart.map((item) => (
            <article key={item.id} className="rounded-[28px] border border-white/10 bg-slate-100 p-5 text-slate-900 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <button
                  onClick={() => onViewProduct(item.id)}
                  className="flex h-32 w-full shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-orange-200 via-white to-slate-200 lg:w-36"
                >
                  <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-slate-900 px-4 py-4 text-lg font-bold tracking-[0.24em] text-white shadow-panel">
                    {item.image}
                  </div>
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <button
                    onClick={() => onViewProduct(item.id)}
                    className="text-left text-xl font-semibold transition hover:text-fibo-blue"
                  >
                    {item.name}
                  </button>
                  <p className="text-sm text-slate-600">{item.spec}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>SKU: {item.sku}</span>
                    <span>{item.brand}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                  <p className="text-2xl font-semibold">{formatPrice(item.price * item.quantity)}</p>

                  <div className="inline-flex items-center rounded-full border border-slate-300 bg-white">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-4 py-2 text-slate-700">
                      -
                    </button>
                    <span className="min-w-12 px-2 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-slate-700">
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-slate-100 p-6 text-slate-900 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-fibo-orange">Summary</p>
          <h2 className="mt-4 text-2xl font-semibold">Order overview</h2>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">Total</span>
                <span className="text-3xl font-semibold text-slate-900">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-fibo-orange px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
            Checkout
          </button>
        </aside>
      </div>
    </section>
  );
}
