import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
  getFormattedPrice,
  getParsedNumber,
  isLegalPriceValue,
} from "@/utils/number-format";

type NumberProps = {
  number: number;
  siteLanguage: string;
  currency: string;
  label: string;
  onChange: (newValue: number) => void;
  onFocus?: (newValue: number) => void;
  unit: string;
};

const NumberInput = ({
  number,
  siteLanguage,
  currency,
  label,
  onChange,
  unit,
}: NumberProps) => {
  const intl = useIntl();
  const [displayNumber, setDisplayNumber] = useState(
    getFormattedPrice(number, siteLanguage, currency),
  );
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  useEffect(() => {
    if (isNumberFocused) return;

    setDisplayNumber(getFormattedPrice(number, siteLanguage, currency));
  }, [number, currency, isNumberFocused]);

  const handleDisplayNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const displayNumber = event.target.value;

    if (!isLegalPriceValue(displayNumber, siteLanguage)) return;

    setDisplayNumber(displayNumber);

    onChange(getParsedNumber(displayNumber, siteLanguage));
  };

  return (
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
        setDisplayNumber(getFormattedPrice(number, siteLanguage, currency));
        setIsNumberFocused(false);
      }}
      onChange={(value) => {
        handleDisplayNumberChange(value);
      }}
      id={`${label.toLowerCase()}_number`}
      autoComplete="off"
      inputMode="decimal"
      pattern="^[0-9]*[.,]?[0-9]*$"
      className="number"
      aria-label={intl.formatMessage(
        { id: "amountPaidPerUnit" },
        { unit, currency },
      )}
    />
  );
};

export default NumberInput;
