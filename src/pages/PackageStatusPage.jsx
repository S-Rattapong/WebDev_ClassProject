import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { formatPrice } from "../data";
import { fetchOrdersByUserEmail } from "../lib/orderService";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const STATUS_TONE = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function PackageStatusPage() {
  const { currentUser, products } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const variantLookup = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      (product.product_variants || []).forEach((variant) => {
        map.set(variant.variant_id, {
          productName: product.name,
          attributes: variant.attributes || {},
          unitPrice: variant.price || 0,
        });
      });
    });
    return map;
  }, [products]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser?.email) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await fetchOrdersByUserEmail(currentUser.email);
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to load package status.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser?.email]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-100 p-8 text-slate-900 shadow-soft">
          <p className="text-sm text-slate-600">Loading package status...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-white/10 bg-slate-100 p-8 text-slate-900 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-fibo-orange">Delivery</p>
        <h1 className="mt-4 text-3xl font-semibold">Check package status</h1>

        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {!error && orders.length === 0 ? (
          <p className="mt-4 text-sm leading-7 text-slate-600">No orders yet. Your package status will appear here after checkout.</p>
        ) : null}

        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const orderItems = order.ORDER_ITEMS || [];
            const total = orderItems.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
            const status = String(order.order_status || "pending").toLowerCase();
            const statusTone = STATUS_TONE[status] || "bg-slate-200 text-slate-700";

            return (
              <article key={order.order_id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Order ID</p>
                    <p className="font-mono text-sm text-slate-700">{order.order_id}</p>
                    <p className="mt-1 text-xs text-slate-500">Ordered: {formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}>{status}</span>
                    <p className="mt-2 text-sm font-semibold text-slate-900">Total: {formatPrice(total)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                  {orderItems.map((item) => {
                    const variant = variantLookup.get(item.variant_id);
                    return (
                      <div key={item.order_items_id} className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">{variant?.productName || "Unknown product"}</p>
                        <p className="mt-1 text-xs text-slate-500">Variant: {String(item.variant_id).slice(0, 8)}...</p>
                        {variant?.attributes && Object.keys(variant.attributes).length > 0 ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {Object.entries(variant.attributes)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(" | ")}
                          </p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="text-slate-600">Qty: {item.quantity}</span>
                          <span className="font-medium text-slate-900">{formatPrice(Number(item.total_price || 0))}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
