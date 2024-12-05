import "./GasPrice.css";
import { isLegalPriceValue } from "./utils/numberFormat";

function GasPrice({
  label,
  number,
  onChange: extraOnChange,
  disabled,
  id,
}: {
  label: string;
  number: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id: string;
}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!isLegalPriceValue(newValue)) return;

    if (extraOnChange) {
      extraOnChange(event);
    }
  }

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
