import { Units } from "@/components/unit/unit";
import getGasPrice from "@/utils/get-gas-price";
import { createContext } from "react";

export type GasPriceContext = {
  number: number;
  setNumber: (number: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  unit: Units;
  setUnit: (unit: Units) => void;
} | null;

type GasPriceAction = {
  type: "update" | "setDriver";
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
    case "setDriver":
      if (action.id === "top") {
        return {
          top: { ...gasPrices.top, driving: true },
          bottom: { ...gasPrices.bottom, driving: false },
        };
      } else {
        return {
          top: { ...gasPrices.top, driving: false },
          bottom: { ...gasPrices.bottom, driving: true },
        };
      }
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

export const GasPricesContext = createContext<GasPrices>(null);
export const GasPricesDispatchContext = createContext<React.Dispatch<any>>(
  () => {},
);
