import { useEffect, useRef, useState } from "react";
import "./GasPrice.css";
import { dollarCost, getFormattedPrice, getNumberFormatChar, isLegalPriceValue } from "./utils/numberFormat";

function GasPrice({
  label,
  number,
  onNumberChange: handleNumberChange = () => { },
  onUnitChange: handleUnitChange = () => { },
  onCurrencyChange: handleCurrencyChange = () => { },
  disabled,
  currency,
  unit,
}: {
  label: string;
  number: number;
  currency: keyof typeof dollarCost;
  unit: string;
  onNumberChange: (newValue: number) => void;
  onCurrencyChange: (newValue: keyof typeof dollarCost) => void;
  onUnitChange: (newUnit: "liter" | "gallon") => void;
  onNumberBlur?: (newValue: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  id: string;
}) {
  const [displayNumber, setDisplayNumber] = useState(getFormattedPrice(number, "en-US", currency));
  const [numberFocused, setNumberFocused] = useState(false);
  const numberRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLSelectElement>(null);
  const unitRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (numberFocused) return

    setDisplayNumber(getFormattedPrice(number, "en-US", currency));
  }, [number, currency]);

  const handleDisplayNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const displayNumber = event.target.value;

    if (!isLegalPriceValue(displayNumber)) return

    setDisplayNumber(displayNumber);

    const number = Number(displayNumber.replace(
      new RegExp(
        getNumberFormatChar("groupingSeparatorChar", "en-US"),
        "g",
      ),
      "",
    ));

    handleNumberChange(number);
  }

  return (
    <fieldset>
      <label>
        {label} gas price ({currency} per {unit})
        <input
          ref={numberRef}
          type="text"
          value={displayNumber}
          onFocus={() => {
            setNumberFocused(true);
          }}
          onBlur={() => {
            setDisplayNumber(getFormattedPrice(number, "en-US", currency));
            setNumberFocused(false);
          }}
          onChange={handleDisplayNumberChange}
          id={`${label.toLowerCase()}_number`}
          disabled={disabled}
          autoComplete="off"
          inputMode="numeric"
          pattern="^[0-9]*[.,]?[0-9]*$"
        />
      </label>

      <label>
        {label} currency
        <select
          ref={currencyRef}
          id={`${label.toLowerCase()}_currency`}
          defaultValue={currency}
          onChange={(event) => handleCurrencyChange(event.target.value as keyof typeof dollarCost)}
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
          ref={unitRef}
          id={`${label.toLowerCase()}_unit`}
          defaultValue={unit}
          onChange={(event) => handleUnitChange(event.target.value as "liter" | "gallon")}
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
