function FilterSection({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">{title}</h3>
      {children}
    </section>
  );
}

export default function SidebarFilter({
  searchTerm,
  setSearchTerm,
  selectedBrand,
  setSelectedBrand,
  selectedType,
  setSelectedType,
  selectedAvailability,
  setSelectedAvailability,
  maxPrice,
  setMaxPrice,
  brands,
  types,
  formatPrice,
}) {
  return (
    <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur">
      <div className="space-y-6">
        <FilterSection title="Search within category">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
              placeholder="ค้นหาสินค้าในหมวดนี้"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </FilterSection>

        <FilterSection title="Brand">
          <select
            value={selectedBrand}
            onChange={(event) => setSelectedBrand(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-900 text-white">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand} className="bg-slate-900 text-white">
                {brand}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection title="Price range">
          <input
            type="range"
            min="0"
            max="6000"
            step="100"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="mt-3 rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">ถึง {formatPrice(maxPrice)}</div>
        </FilterSection>

        <FilterSection title="Product type">
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-900 text-white">All product types</option>
            {types.map((type) => (
              <option key={type} value={type} className="bg-slate-900 text-white">
                {type}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection title="Availability">
          <div className="space-y-3">
            {[
              ["all", "All statuses"],
              ["in-stock", "พร้อมส่ง"],
              ["limited", "สินค้าจำกัด"],
              ["preorder", "พรีออเดอร์"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="radio"
                  name="availability"
                  checked={selectedAvailability === value}
                  onChange={() => setSelectedAvailability(value)}
                  className="accent-orange-500"
                />
                {label}
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
