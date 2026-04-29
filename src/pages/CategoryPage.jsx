import { categories } from "../data";
import CategoryCard from "../components/CategoryCard";

export default function CategoryPage({ onSelectCategory }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Categories</p>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">เลือกหมวดหมู่สินค้า</h2>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onClick={() => onSelectCategory(category.id)} />
        ))}
      </div>
    </section>
  );
}
