import {
  GasPricesContext,
  GasPricesDispatchContext,
} from "@/context/gas-price-context";
import "./gas-price.css";
import { useContext } from "react";
import NumberInput from "@/components/number-input/number-input";
import CurrencySelect from "@/components/currency-select/currency-select";
import UnitSelect from "@/components/unit-select/unit-select";
import { getFormattedPrice, isTinyNumber } from "@/utils/number-format";
import { FormattedMessage } from "react-intl";
import type { ExchangeRateData } from "@/utils/exchange-rate-data.server";

type GasPriceProps = {
  label: string;
  gasPricesKey: "top" | "bottom";
  siteLanguage: string;
  exchangeRateData: ExchangeRateData;
};

function GasPrice({
  label,
  gasPricesKey,
  siteLanguage,
  exchangeRateData,
}: GasPriceProps) {
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
        <legend className="text-3xl font-bold my-4">{label}</legend>
        <NumberInput
          currency={currency}
          label={label}
          unit={unit}
          number={number}
          onChange={(newValue) => {
            if (newValue === number) return; // Return early the value wouldn't change
            updateHandler({ key: "number", value: newValue });
          }}
        />
        <CurrencySelect
          currency={currency}
          onChange={(newValue) => {
            if (newValue === currency) return; // Return early the value wouldn't change
            updateHandler({ key: "currency", value: newValue });
          }}
          exchangeRateData={exchangeRateData}
          siteLanguage={siteLanguage}
        />
        <UnitSelect
          id={`${label.toLowerCase()}_unit`}
          unit={unit}
          onChange={(newValue) => {
            if (newValue === unit) return; // Return early the value wouldn't change
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
