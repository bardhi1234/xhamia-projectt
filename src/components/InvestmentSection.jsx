import { useState } from "react";

function InvestmentSection({ title, investments, id }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  const allImages = investments.flatMap((item) =>
    (item.images || []).map((img) => img)
  );

  const open = (index) => setCurrentIndex(index);
  const close = () => setCurrentIndex(null);

  const next = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const prev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  return (
    <div id={id} className="max-w-7xl mx-auto px-4 py-16">

      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        {title}
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {allImages.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => open(i)}
            className="w-full h-52 md:h-60 object-cover cursor-pointer hover:scale-105 transition rounded-none"
          />
        ))}

      </div>

      {/* SLIDER MODAL */}
      {currentIndex !== null && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
        >

          {/* CLOSE */}
          <button className="absolute top-5 right-5 text-white text-4xl">
            ✕
          </button>

          {/* PREV */}
          <button
            onClick={prev}
            className="absolute left-5 text-white text-5xl"
          >
            ‹
          </button>

          {/* IMAGE */}
          <img
            src={allImages[currentIndex]}
            className="max-w-[92%] max-h-[92%] object-contain"
          />

          {/* NEXT */}
          <button
            onClick={next}
            className="absolute right-5 text-white text-5xl"
          >
            ›
          </button>

        </div>
      )}

    </div>
  );
}

export default InvestmentSection;