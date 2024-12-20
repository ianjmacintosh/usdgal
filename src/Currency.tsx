import * as Ariakit from "@ariakit/react";
import { SelectRenderer } from "@ariakit/react-core/select/select-renderer";
import kebabCase from "lodash-es/kebabCase.js";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useState } from "react";
import { symbols, } from "./exchangeRateData"
import "./Currency.css";

const currencyCodes = Object.keys(symbols)
const currencies = currencyCodes.map((code) => ({ code, name: `${symbols[code]} (${code})` }))

function getItem({ code: currencyCode, name: currencyName }: { code: string, name: string }) {
    return {
        id: `item-${kebabCase(currencyCode)}`,
        value: currencyCode,
        children: currencyName,
    };
}

const defaultItems = currencies.map(getItem);

export default function Currency({
    currency,
    onCurrencyChange,
}: {
    currency: string,
    onCurrencyChange: (newValue: string) => void
}) {
    const [searchValue, setSearchValue] = useState("");
    const [matches, setMatches] = useState(() => defaultItems);

    const combobox = Ariakit.useComboboxStore({
        defaultItems,
        resetValueOnHide: true,
        value: searchValue,
        setValue: setSearchValue,
        placement: "bottom-end"
    });
    const select = Ariakit.useSelectStore({
        combobox,
        defaultItems,
        defaultValue: currency,
    });

    const selectValue = Ariakit.useStoreState(select, "value");

    useEffect(() => {
        startTransition(() => {
            const items = matchSorter(currencies, searchValue, { keys: ["name"] });
            setMatches(items.map(getItem));
        });
    }, [searchValue]);

    useEffect(() => {
        onCurrencyChange(selectValue)
    }, [onCurrencyChange, selectValue])

    return (
        <>
            <Ariakit.Select store={select} className="currency-button button" aria-label="Currency">
                <span className="select-value">
                    {selectValue}
                </span>
                <Ariakit.SelectArrow />
            </Ariakit.Select>
            <Ariakit.SelectPopover
                store={select}
                gutter={4}
                className="popover"

            >
                <div className="combobox-wrapper">
                    <Ariakit.Combobox
                        store={combobox}
                        autoSelect
                        placeholder="Search for a currency..."
                        className="combobox"
                    />
                </div>
                <Ariakit.ComboboxList store={combobox}>
                    <SelectRenderer store={select} items={matches} gap={8} overscan={1}>

                        {({ value, children, ...item }) => (
                            <Ariakit.ComboboxItem
                                key={item.id}
                                {...item}
                                className="select-item"
                                render={<Ariakit.SelectItem value={value} />}
                            >
                                <span className="select-item-value">{children}</span>
                            </Ariakit.ComboboxItem>
                        )}
                    </SelectRenderer>
                </Ariakit.ComboboxList>
            </Ariakit.SelectPopover>
        </>
    );
}