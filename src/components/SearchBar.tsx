export interface HeroOption {
  value: string;
  label: string;
}

export interface SearchBarProps {
  states: HeroOption[];
  destinations: HeroOption[];
  cities: HeroOption[];
  /** Rendered inside the hero's own container — drops the section shell. */
  embedded?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * The catalogue search bar.
 *
 * A curved rectangle panel: four pill fields and the submit button, all inside
 * the same card. Embedded, it closes the foot of the hero viewport; standalone,
 * it sits in its own band under whatever precedes it.
 */
export function SearchBar({ states, destinations, cities, embedded = false }: SearchBarProps) {
  const form = (
    <form
      action="/packages"
      method="get"
      className="hero-form-in rounded-[1.75rem] border border-border bg-raised p-4 shadow-float sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-2.5">
        <Field label="State" name="state" options={states} placeholder="All States" icon="pin" />
        <Field
          label="Destination"
          name="destination"
          options={destinations}
          placeholder="All Destinations"
          icon="compass"
        />
        <Field label="Departure City" name="city" options={cities} placeholder="All Cities" icon="train" />
        <Field
          label="Travel Month"
          name="month"
          placeholder="Any Month"
          icon="calendar"
          options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
        />
        <button
          type="submit"
          className="group/find mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-azure-900 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark shadow-lift transition-all duration-300 hover:bg-vermilion-500 hover:text-white lg:mt-0"
        >
          Find Tours
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );

  if (embedded) return form;

  return (
    <section className="relative z-10 bg-bg">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">{form}</div>
    </section>
  );
}

const FIELD_ICONS = {
  pin: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  train: 'M6 3.5h12v11H6zM6 14.5l-2 6M18 14.5l2 6M6 9h12',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
} as const;

function Field({
  label,
  name,
  options,
  placeholder,
  icon,
}: {
  label: string;
  name: string;
  options: HeroOption[];
  placeholder: string;
  icon: keyof typeof FIELD_ICONS;
}) {
  return (
    <label className="group/field relative flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-2.5 transition-colors duration-300 focus-within:border-vermilion-500 hover:border-border-strong">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vermilion-50 text-vermilion-700">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={FIELD_ICONS[icon]} />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-subtle">{label}</span>
        <select
          name={name}
          defaultValue=""
          aria-label={label}
          className="-ml-0.5 w-full cursor-pointer appearance-none truncate bg-transparent pr-5 text-[13.5px] font-medium text-text outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3.5 h-4 w-4 text-subtle transition-transform duration-300 group-focus-within/field:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
