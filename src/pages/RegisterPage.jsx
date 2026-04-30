import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function RegisterPage({ onNavigateLogin, onNavigateHome }) {
  const { register } = useAppContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (data?.user?.identities?.length === 0) {
        setError("This email is already registered. Please login instead.");
      } else {
        setSuccess("Registration successful! Redirecting to login…");
        setTimeout(() => onNavigateLogin(), 1500);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-lg rounded-[32px] border border-white/10 bg-slate-100 p-8 text-slate-900 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-fibo-orange">New account</p>
        <h1 className="mt-4 text-3xl font-semibold">Register</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Create your account to start shopping with FIBO-MART.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Username</span>
            <input
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              type="text"
              placeholder="Your username"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fibo-blue disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              type="email"
              placeholder="you@example.com"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fibo-blue disabled:opacity-50"
            />
          </label>


          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                type="password"
                placeholder="Create password"
                disabled={loading}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fibo-blue disabled:opacity-50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Confirm password</span>
              <input
                value={form.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                type="password"
                placeholder="Confirm password"
                disabled={loading}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fibo-blue disabled:opacity-50"
              />
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-fibo-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <button onClick={onNavigateLogin} className="text-left font-medium text-fibo-blue transition hover:text-blue-700">
            Already have an account? Login
          </button>
          <button onClick={onNavigateHome} className="text-left text-slate-500 transition hover:text-slate-900">
            Back to home
          </button>
        </div>
      </div>
    </section>
  );
}
