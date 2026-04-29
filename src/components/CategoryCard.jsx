import { ArrowRightIcon } from "./Icons";

export default function CategoryCard({ category, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-[24px] border border-white/10 bg-slate-100 text-left shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-glow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.tone} text-lg font-bold text-white shadow-lg`}>
            {category.icon}
          </div>
          <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white">
            {category.count.toLocaleString()} items
          </span>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">{category.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-fibo-orange">
          Browse category
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
