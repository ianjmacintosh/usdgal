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
  const response = await fetch(
    "https://exchange-rate-api.ian-01c.workers.dev/",
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.status}`);
  }
  return response.json();
}
