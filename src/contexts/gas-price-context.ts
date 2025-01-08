import { getCurrencyByCountry, getUnitsByCountry } from "@/utils/locale-data";
import { Units } from "@/components/unit/unit";
import getGasPrice from "@/utils/get-gas-price";
import { createContext } from "react";

type GasPriceAction = {
  type: "update";
  id: string;
  payload: GasPrice;
};

type GasPrice = {
  number: number;
  currency: string;
  unit: Units;
  driving?: boolean;
};

export type GasPrices = {
  top: GasPrice;
  bottom: GasPrice;
};

export function gasPricesReducer(gasPrices: GasPrices, action: GasPriceAction) {
  switch (action.type) {
    case "update":
      if (action.id === "top") {
        return {
          top: { ...action.payload, driving: true },
          bottom: {
            ...gasPrices.bottom,
            number: getGasPrice(
              action.payload.number,
              action.payload.currency,
              action.payload.unit,
              gasPrices.bottom.currency,
              gasPrices.bottom.unit,
            ),
            driving: false,
          },
        };
      } else {
        return {
          top: {
            ...gasPrices.top,
            number: getGasPrice(
              action.payload.number,
              action.payload.currency,
              action.payload.unit,
              gasPrices.top.currency,
              gasPrices.top.unit,
            ),
            driving: false,
          },
          bottom: { ...action.payload, driving: true },
        };
      }
    default:
      return gasPrices;
  }
}

const userHomeCountry = "US";

export const initialGasPrices = {
  top: {
    number: 0,
    currency: "BRL",
    unit: "liter" as Units,
    driving: true,
  },
  bottom: {
    number: 0,
    currency: getCurrencyByCountry(userHomeCountry) || "USD",
    unit: getUnitsByCountry(userHomeCountry) || ("gallon" as Units),
    driving: false,
  },
};

export const GasPricesContext = createContext<GasPrices>(initialGasPrices);
export const GasPricesDispatchContext = createContext<
  React.Dispatch<GasPriceAction>
>(() => {});
