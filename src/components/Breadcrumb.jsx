export default function Breadcrumb({ categoryName, onNavigateHome }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
      <button onClick={onNavigateHome} className="transition hover:text-white">
        Home
      </button>
      <span>&gt;</span>
      <button onClick={onNavigateHome} className="transition hover:text-white">
        Categories
      </button>
      <span>&gt;</span>
      <span className="text-white">{categoryName}</span>
    </div>
  );
}
