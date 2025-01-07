import {
  BottomGasPriceContext,
  TopGasPriceContext,
} from "@/contexts/gas-price-context";
import "./gas-price.css";
import { useContext } from "react";
import Number from "../number/number";
import Currency from "../currency/currency";
import Unit, { Units } from "../unit/unit";

type GasPriceProps = {
  label: string;
  contextName: string;
};

function GasPrice({ label, contextName }: GasPriceProps) {
  const context = useContext(
    contextName === "top" ? TopGasPriceContext : BottomGasPriceContext,
  );

  if (!context) {
    return;
  }

  const { number, setNumber, currency, setCurrency, unit, setUnit } = context;

  return (
    <div className="mt-2 mb-8">
      <fieldset>
        <legend>{label}</legend>
        <Number
          currency={currency}
          label="Amount"
          onChange={setNumber}
          unit={unit}
          userLanguage={"en-US"}
          number={number}
        />
        <Currency
          currency={currency}
          onChange={(newCurrency: string) => {
            setCurrency(newCurrency);
          }}
          userLanguage={"en-US"}
        />
        <Unit
          id="bottom_unit"
          unit={unit}
          onChange={(newUnit: Units) => {
            setUnit(newUnit);
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
