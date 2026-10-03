interface RiderSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function RiderSearch({ value, onChange }: RiderSearchProps) {
  return (
    <label className="block">
      <span className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-500">
        Search the crew
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name or machine"
        autoComplete="off"
        className="mt-3 h-12 w-full border border-border bg-obsidian-900 px-4 text-sm text-ivory-100 outline-none placeholder:text-graphite-400 focus-visible:border-gold-500"
      />
    </label>
  );
}
