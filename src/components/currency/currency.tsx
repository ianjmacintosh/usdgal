import * as Ariakit from "@ariakit/react";
import { startTransition, useEffect, useMemo, useState } from "react";
import "./currency.css";
import { matchSorter } from "match-sorter";
import { debounce } from "lodash-es";
import { currenciesSelectStoreItems } from "@/utils/exchange-rate-data";

type CurrencyProps = {
  currency: string;
  onChange: (newValue: string) => void;
  userLanguage: string;
};

export default function Currency({
  currency,
  onChange,
  userLanguage,
}: CurrencyProps) {
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

  // useEffect(() => {
  //   onChange(selectValue);
  // }, [currency, onChange, selectValue]);

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
        setValue={onChange}
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
