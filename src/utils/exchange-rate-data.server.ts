import { CurrencyCode } from "./get-currencies";

export type ExchangeRateData = {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key in CurrencyCode]: number;
  };
};

// Export a TS type for symbols (currency symbols) from the symbols variable

export async function getExchangeRateData() {
  const response = await fetch("https://gasco.st/workers/exchange-rates");
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.status}`);
  }
  return response.json();
}

export const fakeExchangeRateData = {
  success: true,
  timestamp: 1759794243,
  base: "EUR",
  date: "2025-10-07",
  rates: {
    USD: 1.2,
    JPY: 120,
    EUR: 1,
    BRL: 6,
    GBP: 0.8,
    MXN: 20,
    BTC: 0.0001,
  },
};
