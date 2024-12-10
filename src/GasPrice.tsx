import { useEffect, useState } from "react";
import "./GasPrice.css";
import { dollarCost, getFormattedPrice, getNumberFormatChar, isLegalPriceValue } from "./utils/numberFormat";

type SupportedCurrencies = keyof typeof dollarCost;
type SupportedUnits = "liter" | "gallon";

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
  currency: SupportedCurrencies;
  unit: string;
  onNumberChange: (newValue: number) => void;
  onCurrencyChange: (newValue: SupportedCurrencies) => void;
  onUnitChange: (newUnit: SupportedUnits) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  id: string;
}) {
  const [displayNumber, setDisplayNumber] = useState(getFormattedPrice(number, "en-US", currency));
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  useEffect(() => {
    if (isNumberFocused) return

    setDisplayNumber(getFormattedPrice(number, "en-US", currency));
  }, [number, currency, isNumberFocused]);

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
      <legend>{label}</legend>
      {/* <label htmlFor={`${label}_number`}>
      </label> */}
      <input
        type="text"
        value={displayNumber}
        onFocus={() => {
          setIsNumberFocused(true);
        }}
        onBlur={() => {
          setDisplayNumber(getFormattedPrice(number, "en-US", currency));
          setIsNumberFocused(false);
        }}
        onChange={handleDisplayNumberChange}
        id={`${label.toLowerCase()}_number`}
        disabled={disabled}
        autoComplete="off"
        inputMode="numeric"
        pattern="^[0-9]*[.,]?[0-9]*$"
        className="number"
        aria-label={`Amount of ${currency} paid per ${unit} of gas`}
      />
      <select
        id={`${label.toLowerCase()}_currency`}
        defaultValue={currency}
        onChange={(event) => handleCurrencyChange(event.target.value as SupportedCurrencies)}
        aria-label={`Currency`}
        disabled={disabled}
        className="currency"
      >
        <option value="USD">USD</option>
        <option value="BRL">BRL</option>
      </select>
      <select
        id={`${label.toLowerCase()}_unit`}
        defaultValue={unit}
        onChange={(event) => handleUnitChange(event.target.value as SupportedUnits)}
        aria-label={`Unit of sale (liters or gallons)`}
        disabled={disabled}
        className="unit"
      >
        <option value="gallon">per gallon</option>
        <option value="liter">per liter</option>
      </select>
    </fieldset>
  );
}

export default GasPrice;
