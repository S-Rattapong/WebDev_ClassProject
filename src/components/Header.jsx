import { useState } from "react";
import { CartIcon, HelpIcon, MenuIcon } from "./Icons";
import SearchBar from "./SearchBar";

function HeaderIcon({ children, label, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-fibo-blue hover:text-fibo-blue"
    >
      {children}
      {badge ? (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default function Header({
  onNavigateHome,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateCart,
  cartCount,
  isLoggedIn,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <button onClick={onNavigateHome} className="flex items-center gap-3 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fibo-blue to-blue-800 text-sm font-bold tracking-[0.24em] text-white">
                FM
              </div>
              <div className="flex items-center gap-3">
                <p className="whitespace-nowrap text-2xl font-black tracking-tight text-white">FIBO-MART</p>
              </div>
            </button>

            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="order-3 w-full lg:order-2 lg:max-w-3xl">
            <SearchBar />
          </div>

          <div className="order-2 flex items-center justify-between gap-2 sm:gap-3 lg:order-3 lg:justify-end">
            <HeaderIcon label="Cart" badge={cartCount > 0 ? String(cartCount) : undefined} onClick={onNavigateCart}>
              <CartIcon className="h-5 w-5" />
            </HeaderIcon>
            <HeaderIcon label="Help">
              <HelpIcon className="h-5 w-5" />
            </HeaderIcon>
            <button
              onClick={onNavigateCart}
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-fibo-blue hover:text-fibo-blue sm:inline-flex"
            >
              Cart
            </button>
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="hidden rounded-xl bg-fibo-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:inline-flex"
              >
                Logout
              </button>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  onClick={onNavigateLogin}
                  className="rounded-xl bg-fibo-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={onNavigateRegister}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-fibo-blue hover:text-fibo-blue"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-slate-950/90 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={onNavigateCart}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700"
            >
              Cart ({cartCount})
            </button>
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="rounded-xl bg-fibo-blue px-4 py-3 text-left text-sm font-semibold text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateLogin}
                  className="rounded-xl bg-fibo-blue px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  Login
                </button>
                <button
                  onClick={onNavigateRegister}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
