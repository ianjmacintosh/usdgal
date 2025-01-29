import * as Ariakit from "@ariakit/react";
import { startTransition, useEffect, useMemo, useState } from "react";
import "./currency-select.css";
import { matchSorter } from "match-sorter";
import { debounce } from "lodash-es";
import { currenciesSelectStoreItems } from "@/utils/exchange-rate-data";

type CurrencySelectProps = {
  currency: string;
  onChange: (newValue: string) => void;
  siteLanguage: string;
};

export default function CurrencySelect({
  currency,
  onChange,
  siteLanguage,
}: CurrencySelectProps) {
  const [searchValue, setSearchValue] = useState("");
  const selectValue = currency;
  const [listItems, setListItems] = useState(
    currenciesSelectStoreItems(siteLanguage),
  );
  useEffect(() => {
    setListItems(currenciesSelectStoreItems(siteLanguage));
  }, [siteLanguage]);

  const matches = useMemo(() => {
    return matchSorter(listItems, searchValue, {
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
      keys: ["children"],
    });
  }, [listItems, searchValue]);

  const popover = Ariakit.usePopoverStore();
  const placement = Ariakit.useStoreState(popover, "currentPlacement");
  const selectListAtBottom = false;
  const selectListAtTop = false;

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
        popover={popover}
      >
        <Ariakit.Select
          className="currency-button button"
          aria-label="Currency"
        >
          <span className="current-value">{selectValue}</span>
          <Ariakit.SelectArrow className="chevron" />
        </Ariakit.Select>
        <Ariakit.SelectPopover
          className={`popover currency-popover placement-${placement}`}
          unmountOnHide={true}
          gutter={4}
          onScroll={(event) => {
            const target = event.target as HTMLElement;
            // const lowestPossible = listboxHeight + comboboxwrapper
            if (target.scrollTop === 0) {
              console.log("We at the top");
            } else {
              console.log(
                getComputedStyle(target).getPropertyValue(
                  "--popover-available-height",
                ),
              );
            }

            if (target.scrollTop === 6000) {
              console.log("We at the bottom");
            }
          }}
        >
          <div className="combobox-wrapper">
            <Ariakit.Combobox
              autoSelect
              placeholder="Search for a currency..."
              className="combobox"
            />
          </div>
          <div className="popover-top-fog"></div>
          <Ariakit.ComboboxList
            className={
              (selectListAtBottom ? "at-bottom" : "") +
              " currency-combobox-list"
            }
          >
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
          <div className="popover-bottom-fog"></div>
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </Ariakit.ComboboxProvider>
  );
}
