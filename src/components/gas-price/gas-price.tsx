import {
  GasPricesContext,
  GasPricesDispatchContext,
} from "@/contexts/gas-price-context";
import "./gas-price.css";
import { useContext } from "react";
import NumberInput from "@/components/number-input/number-input";
import CurrencySelect from "@/components/currency-select/currency-select";
import UnitSelect from "@/components/unit-select/unit-select";
import { getFormattedPrice, isTinyNumber } from "@/utils/number-format";
import { FormattedMessage } from "react-intl";

type GasPriceProps = {
  label: string;
  gasPricesKey: "top" | "bottom";
  siteLanguage: string;
};

function GasPrice({ label, gasPricesKey, siteLanguage }: GasPriceProps) {
  const context = useContext(GasPricesContext);
  const dispatch = useContext(GasPricesDispatchContext);

  if (!context) {
    return;
  }

  const updateHandler = ({
    key,
    value: newValue,
  }: {
    value: number | string;
    key: string;
  }) => {
    dispatch({
      type: "update",
      id: gasPricesKey,
      payload: { key: key as "number" | "currency" | "unit", value: newValue },
    });
  };

  const { number, currency, unit } = context[gasPricesKey as "top" | "bottom"];
  const displayNumber = getFormattedPrice(number, siteLanguage, currency);

  return (
    <div className="mt-2 mb-8">
      <fieldset>
        <legend>{label}</legend>
        <NumberInput
          currency={currency}
          label={label}
          unit={unit}
          siteLanguage={siteLanguage}
          number={number}
          onChange={(newValue) => {
            if (newValue === number) {
              return;
            }
            updateHandler({ key: "number", value: newValue });
          }}
        />
        <CurrencySelect
          currency={currency}
          onChange={(newValue) => {
            if (newValue === currency) {
              return;
            }
            updateHandler({ key: "currency", value: newValue });
          }}
          siteLanguage={siteLanguage}
        />
        <UnitSelect
          id={`${label.toLowerCase()}_unit`}
          unit={unit}
          onChange={(newValue) => {
            if (newValue === unit) {
              return;
            }
            updateHandler({ key: "unit", value: newValue });
          }}
        />
      </fieldset>
      {isTinyNumber(number, siteLanguage, currency) ? (
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
