import { Units } from "@/components/unit/unit";
import { createContext } from "react";

export type GasPriceContext = {
  number: number;
  setNumber: (number: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  unit: Units;
  setUnit: (unit: Units) => void;
} | null;

export const TopGasPriceContext = createContext<GasPriceContext>(null);
export const BottomGasPriceContext = createContext<GasPriceContext>(null);
