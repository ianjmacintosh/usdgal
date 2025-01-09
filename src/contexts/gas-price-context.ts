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
  driver: "top" | "bottom";
};

export function gasPricesReducer(
  gasPrices: GasPrices,
  action: GasPriceAction,
  options = {},
) {
  switch (action.type) {
    case "update": {
      const newGasPrices = { ...gasPrices };
      // Update which gas price is in control when the number changes
      if (action.payload.key === "number") {
        newGasPrices.driver = action.id;
      }

      // Store which price is doing the driving and which is being driven
      const driver = newGasPrices.driver;
      const driven = newGasPrices.driver === "top" ? "bottom" : "top";

      // Apply the change being requested
      newGasPrices[action.id][action.payload.key] = action.payload.value;

      // Update the number for the non-driven gas price
      newGasPrices[driven].number = getGasPrice(
        newGasPrices[driver].number,
        newGasPrices[driver].currency,
        newGasPrices[driver].unit,
        newGasPrices[driven].currency,
        newGasPrices[driven].unit,
        options?.exchangeRates?.rates,
      );

      // Return the new gas prices object
      return newGasPrices;
    }
    default:
      return gasPrices;
  }
}

export const getInitialGasPrices = (
  userHomeCountry: string,
  userLocation: string,
): GasPrices => {
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
    driver: "top",
  };

  return defaultGasPrices;
};

export const GasPricesContext = createContext<GasPrices | null>(null);
export const GasPricesDispatchContext = createContext<
  React.Dispatch<GasPriceAction>
>(() => {});
