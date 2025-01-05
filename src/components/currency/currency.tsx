import * as Ariakit from "@ariakit/react";
import { startTransition, useEffect, useMemo, useState } from "react";
import "./Currency.css";
import { matchSorter } from "match-sorter";
import { debounce } from "lodash-es";
import { currenciesSelectStoreItems } from "../../exchange-rate-data";

export default function Currency({
  currency,
  onCurrencyChange,
  userLanguage = "en-US",
}: {
  currency: string;
  onCurrencyChange: (newValue: string) => void;
  userLanguage?: string;
}) {
  const [searchValue, setSearchValue] = useState("");
  const selectValue = currency;
  const [listItems, setListItems] = useState(
    currenciesSelectStoreItems(userLanguage),
  );
  useEffect(() => {
    setListItems(currenciesSelectStoreItems(userLanguage));
  }, [userLanguage]);

  const matches = useMemo(() => {
    return matchSorter(listItems, searchValue, {
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
      keys: ["children"],
    });
  }, [listItems, searchValue]);

  useEffect(() => {
    onCurrencyChange(selectValue);
  }, [currency, onCurrencyChange, selectValue]);

  return (
    <Ariakit.ComboboxProvider
      resetValueOnHide
      setValue={debounce((value) => {
        startTransition(() => {
          setSearchValue(value);
        });
      }, 200)}
    >
      <Ariakit.SelectProvider
        defaultValue={currency}
        items={matches}
        setValue={onCurrencyChange}
        value={currency}
        placement="bottom-end"
      >
        <Ariakit.Select
          className="currency-button button"
          aria-label="Currency"
        >
          <span className="current-value">{selectValue}</span>
          <Ariakit.SelectArrow className="chevron" />
        </Ariakit.Select>
        <Ariakit.SelectPopover
          gutter={4}
          className="currency-popover popover"
          unmountOnHide={true}
        >
          <div className="combobox-wrapper">
            <Ariakit.Combobox
              autoSelect
              placeholder="Search for a currency..."
              className="combobox"
            />
          </div>
          <Ariakit.ComboboxList>
            {matches.map(({ value, children, id }) => (
              <Ariakit.SelectItem
                key={value}
                value={value}
                id={id}
                className="select-item"
                render={
                  <Ariakit.ComboboxItem>
                    {selectValue === value ? "✓" : ""} {children}
                  </Ariakit.ComboboxItem>
                }
              />
            ))}
          </Ariakit.ComboboxList>
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </Ariakit.ComboboxProvider>
  );
}
