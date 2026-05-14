import { useEffect, useState } from "react";
import pic1 from "../pic/pic1.png";
import pic2 from "../pic/pic2.png";
import pic3 from "../pic/pic3.png";
import pic4 from "../pic/pic4.png";
import pic5 from "../pic/pic5.png";

const slides = [
  {
    id: "banner-1",
    image: pic1,
    alt: "FIBO-MART promotional banner 1",
  },
  {
    id: "banner-2",
    image: pic2,
    alt: "FIBO-MART promotional banner 2",
  },
  {
    id: "banner-3",
    image: pic3,
    alt: "FIBO-MART promotional banner 3",
  },
  {
    id: "banner-4",
    image: pic4,
    alt: "FIBO-MART promotional banner 4",
  },
  {
    id: "banner-5",
    image: pic5,
    alt: "FIBO-MART promotional banner 5",
  },
];

function SlideCard({ slide }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-soft">
      <img
        src={slide.image}
        alt={slide.alt}
        className="block h-[16rem] w-full object-cover object-center sm:h-[20rem] lg:h-[26rem] xl:h-[30rem]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/12 via-transparent to-white/10" />
    </div>
  );
}

export default function FeaturedShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((current) => (current + 1) % slides.length);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-6">
      <div className="relative">
        <div className="overflow-hidden rounded-[36px]">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full">
                <SlideCard slide={slide} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-lg backdrop-blur transition hover:bg-slate-900"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-lg backdrop-blur transition hover:bg-slate-900"
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="mt-5 flex items-center justify-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${activeIndex === index ? "w-10 bg-fibo-orange" : "w-3 bg-white/35 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
