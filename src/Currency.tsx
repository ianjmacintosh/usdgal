import * as Ariakit from "@ariakit/react";
import kebabCase from "lodash-es/kebabCase.js";
import { startTransition, useEffect, useMemo, useState } from "react";
import { symbols } from "./exchangeRateData";
import "./Currency.css";
import { matchSorter } from "match-sorter";


export default function Currency({
  currency,
  onCurrencyChange,
  currencies: currencyCodes,
}: {
  currency: string;
  onCurrencyChange: (newValue: string) => void;
  currencies: string[];
}) {
  const getCurrencies = () =>
    currencyCodes.map((code) => ({
      id: `item-${kebabCase(code)}`,
      value: code,
      name: symbols[code as keyof typeof symbols],
      children: `${code}: ${symbols[code as keyof typeof symbols]}`,
    }));
  const [currencies] = useState(getCurrencies);

  const [searchValue, setSearchValue] = useState("");
  const [selectValue, setSelectValue] = useState(currency)

  const matches = useMemo(() => {
    return matchSorter(currencies, searchValue, {
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
      keys: ["children"]
    });
  }, [searchValue]);

  useEffect(() => {
    onCurrencyChange(selectValue);
  }, [onCurrencyChange, selectValue]);

  return (
      <Ariakit.ComboboxProvider
        resetValueOnHide
        setValue={(value) => {
          startTransition(() => {
            setSearchValue(value);
          });
        }}
      >
        <Ariakit.SelectProvider defaultValue={currency} defaultItems={matches} setValue={setSelectValue}>
          <Ariakit.Select className="currency-button button" aria-label="Currency"/>
          <Ariakit.SelectPopover gutter={4} className="currency-popover popover" unmountOnHide={true}>
            <div className="combobox-wrapper">
              <Ariakit.Combobox
                autoSelect
                placeholder="Search for a currency..."
                className="combobox"
              />
            </div>
            <Ariakit.ComboboxList>
              {matches.map(({value, children, id}) => (
                <Ariakit.SelectItem
                  key={value}
                  value={value}
                  id={id}
                  className="select-item"
                  render={<Ariakit.ComboboxItem>{selectValue === value ? "✓" : ""} {children}</Ariakit.ComboboxItem>}
                />
              ))}
            </Ariakit.ComboboxList>
          </Ariakit.SelectPopover>
        </Ariakit.SelectProvider>
      </Ariakit.ComboboxProvider>
  );
}
