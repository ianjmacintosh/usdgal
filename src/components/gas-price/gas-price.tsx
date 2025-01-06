import { useEffect, useState } from "react";
import "./gas-price.css";
import {
  getFormattedPrice,
  getParsedNumber,
  isLegalPriceValue,
  isTinyNumber,
} from "@/utils/number-format";
import { FormattedMessage, useIntl } from "react-intl";

type GasPriceProps = {
  label: string;
  number: number;
  currency: string;
  unit: string;
  onNumberChange: (newValue: number) => void;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  disabled?: boolean;
  userLanguage?: string;
  children?: React.ReactNode;
};

function GasPrice({
  label,
  number,
  onNumberChange: handleNumberChange = () => {},
  disabled,
  currency = "",
  unit,
  userLanguage = "en-US",
  children,
}: GasPriceProps) {
  const intl = useIntl();
  const [displayNumber, setDisplayNumber] = useState(
    getFormattedPrice(number, userLanguage, currency),
  );
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  useEffect(() => {
    if (isNumberFocused) return;

    setDisplayNumber(getFormattedPrice(number, userLanguage, currency));
  }, [number, currency, isNumberFocused]);

  const handleDisplayNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const displayNumber = event.target.value;

    if (!isLegalPriceValue(displayNumber, userLanguage)) return;

    setDisplayNumber(displayNumber);

    handleNumberChange(getParsedNumber(displayNumber, userLanguage));
  };

  return (
    <div className="mt-2 mb-8">
      <fieldset>
        <legend>{label}</legend>
        <input
          type="text"
          value={displayNumber}
          onFocus={() => {
            if (number === 0) {
              setDisplayNumber("");
            }
            setIsNumberFocused(true);
          }}
          onBlur={() => {
            setDisplayNumber(getFormattedPrice(number, userLanguage, currency));
            setIsNumberFocused(false);
          }}
          onChange={(value) => {
            handleDisplayNumberChange(value);
          }}
          id={`${label.toLowerCase()}_number`}
          disabled={disabled}
          autoComplete="off"
          inputMode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          className="number"
          aria-label={intl.formatMessage(
            { id: "amountPaidPerUnit" },
            { unit, currency },
          )}
        />
        {children}
      </fieldset>
      {isTinyNumber(number, userLanguage, currency) ? (
        <p className="mt-4">
          <em role="status">
            <FormattedMessage
              id="tinyNumber"
              values={{ displayNumber, currency, number }}
            />
          </em>
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default GasPrice;
