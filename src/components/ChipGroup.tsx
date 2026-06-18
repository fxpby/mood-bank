export type ChipOption<TValue extends string> = {
  value: TValue;
  label: string;
  helper?: string;
};

type ChipGroupProps<TValue extends string> = {
  label: string;
  options: ChipOption<TValue>[];
  value?: TValue;
  onChange: (value: TValue) => void;
  helper?: string;
};

export function ChipGroup<TValue extends string>({
  label,
  options,
  value,
  onChange,
  helper,
}: ChipGroupProps<TValue>) {
  return (
    <fieldset className="chip-group">
      <legend>{label}</legend>
      {helper ? <p>{helper}</p> : null}
      <div className="chip-row">
        {options.map((option) => (
          <button
            className="chip"
            type="button"
            aria-pressed={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            {option.helper ? <small>{option.helper}</small> : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
