import "./GasPrice.css";
import { dollarCost, getFormattedPrice, isLegalPriceValue } from "./utils/numberFormat";

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

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (event.target.id.includes("number")) {
      event.target.value = getFormattedPrice(Number(newValue), "en-US", currency);
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
          onBlur={onBlur}
          id={`${label.toLowerCase()}_number`}
          disabled={label === "Target" || disabled}
          autoComplete="off"
          inputMode="numeric"
          pattern="^[0-9]*[.,]?[0-9]*$"
        />
      </label>

      <label>
        {label} currency
        <select
          id={`${label.toLowerCase()}_currency`}
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
          id={`${label.toLowerCase()}_unit`}
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
