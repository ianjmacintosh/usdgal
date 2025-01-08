import {
  GasPricesContext,
  GasPricesDispatchContext,
} from "@/contexts/gas-price-context";
import "./gas-price.css";
import { useContext } from "react";
import Number from "../number/number";
import Currency from "../currency/currency";
import Unit from "../unit/unit";

type GasPriceProps = {
  label: string;
  gasPricesKey: "top" | "bottom";
};

function GasPrice({ label, gasPricesKey }: GasPriceProps) {
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
      payload: { ...context[gasPricesKey], [key]: newValue },
    });
  };

  const { number, currency, unit } = context[gasPricesKey as "top" | "bottom"];

  return (
    <div className="mt-2 mb-8">
      <fieldset>
        <legend>{label}</legend>
        <Number
          currency={currency}
          label="Amount"
          unit={unit}
          userLanguage={"en-US"}
          number={number}
          onChange={(newValue) => {
            if (newValue === number) {
              return;
            }
            updateHandler({ key: "number", value: newValue });
          }}
        />
        <Currency
          currency={currency}
          onChange={(newValue) => {
            if (newValue === currency) {
              return;
            }
            updateHandler({ key: "currency", value: newValue });
          }}
          userLanguage={"en-US"}
        />
        <Unit
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
      {/* {isTinyNumber(number, userLanguage, currency) ? (
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
      )} */}
    </div>
  );
}

export default GasPrice;
