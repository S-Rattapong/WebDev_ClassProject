import { SearchIcon } from "./Icons";

export default function SearchBar() {
  return (
    <div className="flex w-full items-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <input
        type="search"
        placeholder="ค้นหา เช่น สินค้า / รหัสสินค้า"
        className="h-11 w-full rounded-l-xl border-0 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button className="flex h-11 items-center gap-2 rounded-r-xl bg-fibo-blue px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
        <SearchIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
