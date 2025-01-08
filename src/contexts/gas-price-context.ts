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
          top: { ...action.payload },
          bottom: {
            ...gasPrices.bottom,
            number: getGasPrice(
              action.payload.number,
              action.payload.currency,
              action.payload.unit,
              gasPrices.bottom.currency,
              gasPrices.bottom.unit,
            ),
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
          },
          bottom: { ...action.payload },
        };
      }
    default:
      return gasPrices;
  }
}

export const initialGasPrices = (
  userHomeCountry = "MX",
  userLocation = "US",
) => {
  const topPrice = {
    number: 0,
    currency: getCurrencyByCountry(userLocation),
    unit: getUnitsByCountry(userLocation),
  };
  const bottomPrice = {
    number: 0,
  };

  // If someone's geolocation matches their home country, let's guess where they might want to prepare to go
  if (userLocation === userHomeCountry) {
    // Assumptions:
    // * Americans converting liters and gallons are going to Mexico
    // * Everyone else converting liters and gallons are going to the US
    topPrice.currency = getCurrencyByCountry(
      userHomeCountry === "US" ? "MX" : "US",
    );
    topPrice.unit = getUnitsByCountry(userHomeCountry === "US" ? "MX" : "US");
  }
  return {
    top: {
      ...topPrice,
    },
    bottom: {
      ...bottomPrice,
      currency: getCurrencyByCountry(userHomeCountry),
      unit: getUnitsByCountry(userHomeCountry),
    },
  };
};

export const GasPricesContext = createContext<GasPrices>(initialGasPrices());
export const GasPricesDispatchContext = createContext<
  React.Dispatch<GasPriceAction>
>(() => {});
