import { useEffect, useState } from "react";
import "./GasPrice.css";
import {
  getFormattedPrice,
  getNumberFormatChar,
  isLegalPriceValue,
} from "./utils/numberFormat";
import Currency from "./Currency";
import Unit from "./Unit";

type SupportedUnits = "liter" | "gallon";

function GasPrice({
  label,
  number,
  onNumberChange: handleNumberChange = () => {},
  onUnitChange: handleUnitChange = () => {},
  onCurrencyChange: handleCurrencyChange = () => {},
  disabled,
  currency,
  unit,
}: {
  label: string;
  number: number;
  currency: string;
  unit: string;
  onNumberChange: (newValue: number) => void;
  onCurrencyChange: (newValue: string) => void;
  onUnitChange: (newUnit: SupportedUnits) => void;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  disabled?: boolean;
}) {
  const [displayNumber, setDisplayNumber] = useState(
    getFormattedPrice(number >= 0.01 ? number : 0.01, "en-US", currency),
  );
  const [isNumberFocused, setIsNumberFocused] = useState(false);
  const isTinyNumber =
    Number(getFormattedPrice(number, "en-US", currency)) === 0 && number !== 0;

  useEffect(() => {
    if (isNumberFocused) return;

    let newDisplayNumber = getFormattedPrice(number, "en-US", currency);
    // Never show a non-0 value as 0; show it as the smallest value that can be shown
    if (Number(Number(newDisplayNumber) === 0 && number !== 0)) {
      newDisplayNumber = "0.01";
    }
    setDisplayNumber(newDisplayNumber);
  }, [number, currency, isNumberFocused]);

  const handleDisplayNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const displayNumber = event.target.value;

    if (!isLegalPriceValue(displayNumber)) return;

    setDisplayNumber(displayNumber);

    const number = Number(
      displayNumber.replace(
        new RegExp(getNumberFormatChar("groupingSeparatorChar", "en-US"), "g"),
        "",
      ),
    );

    handleNumberChange(number);
  };

  return (
    <div className="mt-4 mb-8">
      <fieldset>
        <legend>{label}</legend>
        <input
          type="text"
          value={displayNumber}
          onFocus={() => {
            if (displayNumber === "0.00") {
              setDisplayNumber("");
            }
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
          inputMode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          className="number"
          aria-label={`Amount of ${currency} paid per ${unit} of gas`}
        />
        <Currency
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
        ></Currency>
        <Unit
          id={`${label.toLowerCase()}_unit`}
          unit={unit}
          onUnitChange={handleUnitChange}
        />
      </fieldset>

      {isTinyNumber ? (
        <p className="mt-4">
          <em>
            This amount is displayed as {displayNumber} {currency}, but the
            actual amount is less ({number} {currency})
          </em>
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default GasPrice;
