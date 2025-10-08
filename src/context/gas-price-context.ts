import { getCurrencyByCountry, getUnitsByCountry } from "@/utils/locale-data";
import { Units } from "@/components/unit-select/unit-select";
import getGasPrice from "@/utils/get-gas-price";
import { createContext } from "react";
import type { ExchangeRateData } from "@/utils/exchange-rate-data.server";

export type GasPricesUpdateAction = {
  type: "update";
  id: "top" | "bottom";
  payload: { key: "number" | "currency" | "unit"; value: number | string };
  exchangeRates: ExchangeRateData["rates"];
};

export type GasPricesReplaceAction = {
  type: "replace";
  payload: GasPrices;
};

export type GasPricesAction = GasPricesUpdateAction | GasPricesReplaceAction;

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
  action: GasPricesAction,
) {
  switch (action.type) {
    case "update": {
      const { exchangeRates } = action;
      const newGasPrices = { ...gasPrices };
      // Update which gas price is in control when the number changes
      if (action.payload.key === "number") {
        newGasPrices.driver = action.id;
      }

      // Store which price is doing the driving and which is being driven
      const driver = newGasPrices.driver;
      const driven = newGasPrices.driver === "top" ? "bottom" : "top";

      // Apply the change being requested
      newGasPrices[action.id][action.payload.key] = action.payload
        .value as number & string;

      // Update the number for the non-driven gas price
      newGasPrices[driven].number = getGasPrice(
        newGasPrices[driver].number,
        newGasPrices[driver].currency,
        newGasPrices[driver].unit,
        newGasPrices[driven].currency,
        newGasPrices[driven].unit,
        exchangeRates,
      );

      // Return the new gas prices object
      return newGasPrices;
    }
    case "replace": {
      const newGasPrices = action.payload;
      return newGasPrices;
    }
    default:
      return gasPrices;
  }
}

export const getInitialGasPrices = (
  homeCountry: string,
  userLocation: string | null,
): GasPrices => {
  // The imagined "normal" use-case is that someone's in a foreign country and wants to convert from foreign prices to home prices
  let foreignCountry = userLocation || "US";

  const defaultGasPrices = {
    top: {
      number: 0,
      currency: getCurrencyByCountry(foreignCountry),
      unit: getUnitsByCountry(foreignCountry),
    },
    bottom: {
      number: 0,
      currency: getCurrencyByCountry(homeCountry),
      unit: getUnitsByCountry(homeCountry),
    },
    driver: <"top" | "bottom">"top",
  };

  // But if we geolocate someone to their home country (as indicated by their browser)
  //   let's convert gas prices from their home to someplace they might be interested in
  if (homeCountry === userLocation) {
    // If they're from the US, let's guess they're researching MX
    foreignCountry =
      homeCountry === "US"
        ? "MX"
        : // If they're not from the US, let's guess they're researching the US (because they're researching about liters-to-gallons)
          "US";

    defaultGasPrices.top.currency = getCurrencyByCountry(homeCountry);
    defaultGasPrices.top.unit = getUnitsByCountry(homeCountry);
    defaultGasPrices.bottom.currency = getCurrencyByCountry(foreignCountry);
    defaultGasPrices.bottom.unit = getUnitsByCountry(foreignCountry);
  }

  return defaultGasPrices;
};

export const GasPricesContext = createContext<GasPrices | null>(null);
export const GasPricesDispatchContext = createContext<
  React.Dispatch<GasPricesAction>
>(() => {});
