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
  currencies,
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
  currencies: string[];
}) {
  const [displayNumber, setDisplayNumber] = useState(
    getFormattedPrice(number >= 0.01 ? number : 0.01, "en-US", currency),
  );
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  useEffect(() => {
    if (isNumberFocused) return;

    setDisplayNumber(
      getFormattedPrice(
        number > 0.01 || number === 0 ? number : 0.01,
        "en-US",
        currency,
      ),
    );
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
    <div className="my-8">
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
          currencies={currencies}
        ></Currency>
        <Unit
          id={`${label.toLowerCase()}_unit`}
          unit={unit}
          onUnitChange={handleUnitChange}
        />
      </fieldset>
      {displayNumber === "0.01" && number < 0.01 ? (
        <p className="mt-4">
          <em>
            This amount is displayed as 0.01 {currency}, but the actual amount
            is less ({number} {currency})
          </em>
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default GasPrice;
