"use client";

const OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Sort products</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-[44px] rounded-full border border-black/10 bg-white pl-5 pr-11 text-sm font-medium text-black cursor-pointer hover:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-colors"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-4 pointer-events-none text-black"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
