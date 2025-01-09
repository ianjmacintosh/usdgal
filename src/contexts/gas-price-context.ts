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

export const getInitialGasPrices = (
  userHomeCountry: string,
  userLocation: string,
) => {
  // Assume the user wants to know about the place we geolocated them
  let foreignCountry = userLocation;

  // If we geolocate someone to their home country (as indicated by their browser), let's convert gas prices from their home to someplace they might be interested in
  if (userHomeCountry === userLocation) {
    // If they're from the US, let's guess they're researching MX
    foreignCountry =
      userHomeCountry === "US"
        ? "MX"
        : // If they're not from the US, let's guess they're researching the US (because they're researching about liters-to-gallons)
          "US";
  }

  const defaultGasPrices = {
    top: {
      number: 0,
      currency: getCurrencyByCountry(foreignCountry),
      unit: getUnitsByCountry(foreignCountry),
    },
    bottom: {
      number: 0,
      currency: getCurrencyByCountry(userHomeCountry),
      unit: getUnitsByCountry(userHomeCountry),
    },
  };

  return defaultGasPrices;
};

export const GasPricesContext = createContext<GasPrices | null>(null);
export const GasPricesDispatchContext = createContext<
  React.Dispatch<GasPriceAction>
>(() => {});
