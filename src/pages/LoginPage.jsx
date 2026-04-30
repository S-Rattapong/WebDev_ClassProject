import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function LoginPage({ onNavigateRegister, onNavigateHome }) {
  const { authRedirectPath, login, setAuthRedirectPath } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await login({ email: email.trim(), password: password.trim() });
      const destination = authRedirectPath || "/";
      setAuthRedirectPath("/");
      window.location.hash = destination;
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-md rounded-[32px] border border-white/10 bg-slate-100 p-8 text-slate-900 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-fibo-orange">Account access</p>
        <h1 className="mt-4 text-3xl font-semibold">Login</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Sign in with your registered email and password.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fibo-blue disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Enter your password"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fibo-blue disabled:opacity-50"
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-fibo-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <button onClick={onNavigateRegister} className="text-left font-medium text-fibo-blue transition hover:text-blue-700">
            Create a new account
          </button>
          <button onClick={onNavigateHome} className="text-left text-slate-500 transition hover:text-slate-900">
            Back to home
          </button>
        </div>
      </div>
    </section>
  );
}
