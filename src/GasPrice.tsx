import "./GasPrice.css";

function GasPrice({
  label,
  number,
  onChange,
  disabled,
  id,
}: {
  label: string;
  number: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id: string;
}) {
  return (
    <label htmlFor={id}>
      {label}
      <input
        type="text"
        value={number}
        onChange={onChange}
        name={id}
        id={id}
        disabled={disabled !== undefined ? true : false}
        autoComplete="off"
        inputMode="numeric"
        pattern="^[0-9]*[.,]?[0-9]*$"
      />
    </label>
  );
}

export default GasPrice;
