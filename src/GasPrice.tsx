import "./GasPrice.css";
import { dollarCost, isLegalPriceValue } from "./utils/numberFormat";

function GasPrice({
  label,
  number,
  onChange: extraOnChange,
  disabled,
  currency,
  unit,
}: {
  label: string;
  number: string;
  currency: keyof typeof dollarCost;
  unit: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  id: string;
}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.id.split("_")[1].includes("number")) {
      const newValue = event.target.value;
      if (!isLegalPriceValue(newValue)) return;
    }

    if (extraOnChange) {
      extraOnChange(event);
    }
  }

  return (
    <fieldset>
      <label>
        {label} gas price ({currency} per {unit})
        <input
          type="text"
          value={number}
          onChange={onChange}
          id={`${label}_number`}
          disabled={disabled !== undefined ? true : false}
          autoComplete="off"
          inputMode="numeric"
          pattern="^[0-9]*[.,]?[0-9]*$"
        />
      </label>

      <label>
        {label} currency
        <select
          id={`${label}_currency`}
          defaultValue={currency}
          onChange={onChange}
          aria-description="Currency"
          disabled={disabled}
        >
          <option value="USD">US Dollar (USD)</option>
          <option value="BRL">Brazilian Real (BRL)</option>
        </select>
      </label>
      <label>
        {label} unit of measure
        <select
          id={`${label}_unit`}
          defaultValue={unit}
          onChange={onChange}
          aria-description="Unit of volume"
          disabled={disabled}
        >
          <option value="gallon">gallons</option>
          <option value="liter">liters</option>
        </select>
      </label>
    </fieldset>
  );
}

export default GasPrice;
