interface RiderFiltersProps {
  styles: string[];
  brands: string[];
  positions: string[];
  style: string;
  brand: string;
  position: string;
  onStyle: (value: string) => void;
  onBrand: (value: string) => void;
  onPosition: (value: string) => void;
  styleLabel: (value: string) => string;
}

export function RiderFilters({
  styles,
  brands,
  positions,
  style,
  brand,
  position,
  onStyle,
  onBrand,
  onPosition,
  styleLabel,
}: RiderFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <FilterGroup
        legend="Style"
        options={styles}
        value={style}
        label={styleLabel}
        onChange={onStyle}
      />
      <FilterGroup
        legend="Machine"
        options={brands}
        value={brand}
        label={(item) => item}
        onChange={onBrand}
      />
      <FilterGroup
        legend="Place in the line"
        options={positions}
        value={position}
        label={(item) => item}
        onChange={onPosition}
      />
    </div>
  );
}

function FilterGroup({
  legend,
  options,
  value,
  label,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string;
  label: (value: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[0.68rem] uppercase tracking-[0.28em] text-graphite-300">
        {legend}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip pressed={value === ""} onClick={() => onChange("")}>
          All
        </FilterChip>
        {options.map((option) => (
          <FilterChip
            key={option}
            pressed={value === option}
            onClick={() => onChange(value === option ? "" : option)}
          >
            {label(option)}
          </FilterChip>
        ))}
      </div>
    </fieldset>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? "h-10 cursor-pointer border border-gold-500 bg-gold-500 px-3 text-[0.68rem] uppercase tracking-[0.16em] text-obsidian-950 transition-colors duration-200 active:scale-[0.98] motion-reduce:transform-none"
          : "h-10 cursor-pointer border border-border bg-transparent px-3 text-[0.68rem] uppercase tracking-[0.16em] text-ivory-100 transition-colors duration-200 hover:border-gold-500/60 hover:text-gold-400 active:scale-[0.98] motion-reduce:transform-none"
      }
    >
      {children}
    </button>
  );
}
