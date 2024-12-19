"use client"

import * as Ariakit from "@ariakit/react";
import { SelectRenderer } from "@ariakit/react-core/select/select-renderer";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useState } from "react";
import "./Currency.css"
import { symbols } from "./exchangeRateData";

const Currency = ({
    currency,
    handleCurrencyChange,
    currencies: countries
}: {
    currency: string,
    handleCurrencyChange: (newValue: string) => void,
    currencies: string[]
}) => {
    const verboseCurrencies = countries.map(code => {
        const verboseString = `${symbols[code as keyof typeof symbols]} (${code})`
        return { value: code, label: verboseString, children: verboseString, id: verboseString }
    })
    const defaultItems = verboseCurrencies;
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
            const items = matchSorter(verboseCurrencies, searchValue, { keys: ['label'] });
            setMatches(items);
        });
    }, [searchValue]);

    useEffect(() => {
        handleCurrencyChange(selectValue)
    }, [handleCurrencyChange, selectValue])

    return (
        <>
            <Ariakit.Select store={select} className="currency-button button" aria-label="Currency">
                <span className="select-value">
                    {selectValue || "Select a country"}
                </span>
                <Ariakit.SelectArrow />
            </Ariakit.Select>
            <Ariakit.SelectPopover
                store={select}
                gutter={4}
                className="popover"
                unmountOnHide={true}
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
                        {({ value, ...item }) => (
                            <Ariakit.ComboboxItem
                                key={item.id}
                                {...item}
                                className="select-item"
                                render={<Ariakit.SelectItem value={value}>{selectValue === value ? "✓" : ""} {item.label}</Ariakit.SelectItem>}
                            >
                                <span className="select-item-value">{value}</span>
                            </Ariakit.ComboboxItem>
                        )}
                    </SelectRenderer>
                </Ariakit.ComboboxList>
            </Ariakit.SelectPopover>
        </>
    )
}

export default Currency;