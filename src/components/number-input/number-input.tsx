import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
  getFormattedPrice,
  getParsedNumber,
  isLegalPriceValue,
} from "@/utils/number-format";
import { useI18n } from "@/context/i18n";

type NumberProps = {
  number: number;
  currency: string;
  label: string;
  onChange: (newValue: number) => void;
  onFocus?: (newValue: number) => void;
  unit: string;
};

const NumberInput = ({
  number,
  currency,
  label,
  onChange,
  unit,
}: NumberProps) => {
  const {
    state: { userLanguage },
  } = useI18n();
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

    onChange(getParsedNumber(displayNumber, userLanguage));
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
        setDisplayNumber(getFormattedPrice(number, userLanguage, currency));
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
        {
          unit,
          currency,
        },
      )}
    />
  );
};

export default NumberInput;
