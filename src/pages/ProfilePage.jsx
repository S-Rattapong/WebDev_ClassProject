import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function ProfilePage() {
  const { currentUser, updateUserProfile } = useAppContext();
  const [name, setName] = useState(currentUser?.username || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(currentUser?.username || "");
    setAddress(currentUser?.address || "");
  }, [currentUser?.username, currentUser?.address]);

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile({
        name,
        address,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-100 p-8 text-slate-900 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-fibo-orange">User information</p>
        <h1 className="mt-4 text-3xl font-semibold">Profile</h1>

        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
        ) : null}

        <form onSubmit={handleSave} className="mt-8 space-y-4 text-sm">
          <label className="block">
            <span className="mb-2 block text-slate-500">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              disabled={saving}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-900 outline-none transition focus:border-fibo-blue disabled:opacity-50"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-slate-500">Email</p>
            <p className="mt-1 font-medium text-slate-900">{currentUser?.email || "-"}</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-slate-500">Address</span>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={4}
              disabled={saving}
              className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-900 outline-none transition focus:border-fibo-blue disabled:opacity-50"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-fibo-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
