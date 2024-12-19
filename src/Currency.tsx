"use client"

import * as Ariakit from "@ariakit/react";
import { SelectRenderer } from "@ariakit/react-core/select/select-renderer";
import type { SelectRendererItem } from "@ariakit/react-core/select/select-renderer";
import deburr from "lodash-es/deburr.js";
import groupBy from "lodash-es/groupBy.js";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useState } from "react";
import "./Currency.css"

function getItem(country: string) {
    return {
        id: `item-${country}`,
        value: country,
        children: country,
    };
}

function groupItems(items: ReturnType<typeof getItem>[]) {
    const groups = groupBy(items, (item) => deburr(item.value?.at(0)));
    return Object.entries(groups).map(([label, items]) => {
        return {
            id: `group-${label.toLowerCase()}`,
            label,
            itemSize: 40,
            paddingStart: 44,
            items,
        } satisfies SelectRendererItem;
    });
}



const Currency = ({
    currency,
    handleCurrencyChange,
    currencies: countries
}: {
    currency: string,
    handleCurrencyChange: (newValue: string) => void,
    currencies: string[]
}) => {
    // const countries = ["BRL", "MXN", "USD"]
    const defaultItems = countries.map(getItem);
    const [searchValue, setSearchValue] = useState("");
    const [matches, setMatches] = useState(() => groupItems(defaultItems));

    const combobox = Ariakit.useComboboxStore({
        defaultItems,
        resetValueOnHide: true,
        value: searchValue,
        setValue: setSearchValue,
    });
    const select = Ariakit.useSelectStore({
        combobox,
        defaultItems,
        defaultValue: currency,
    });

    const selectValue = Ariakit.useStoreState(select, "value");

    useEffect(() => {
        startTransition(() => {
            const items = matchSorter(countries, searchValue);
            setMatches(groupItems(items.map(getItem)));
        });
    }, [searchValue]);

    useEffect(() => {
        handleCurrencyChange(selectValue)
    }, [handleCurrencyChange, selectValue])

    return (
        <>
            <Ariakit.Select store={select} className="button" aria-label="Currency">
                <span className="select-value">
                    {selectValue || "Select a country"}
                </span>
                <Ariakit.SelectArrow />
            </Ariakit.Select>
            <Ariakit.SelectPopover
                store={select}
                gutter={4}
                sameWidth
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
                        {({ label, ...item }) => (
                            <SelectRenderer
                                key={item.id}
                                className="group"
                                overscan={1}
                                {...item}
                                render={(props) => (
                                    <Ariakit.SelectGroup {...props}>
                                        <Ariakit.SelectGroupLabel className="group-label">
                                            {label}
                                        </Ariakit.SelectGroupLabel>
                                        {props.children}
                                    </Ariakit.SelectGroup>
                                )}
                            >
                                {({ value, ...item }) => (
                                    <Ariakit.ComboboxItem
                                        key={item.id}
                                        {...item}
                                        className="select-item"
                                        render={<Ariakit.SelectItem value={value} />}
                                    >
                                        <span className="select-item-value">{value}</span>
                                    </Ariakit.ComboboxItem>
                                )}
                            </SelectRenderer>
                        )}
                    </SelectRenderer>
                </Ariakit.ComboboxList>
            </Ariakit.SelectPopover>
        </>
    )
}

export default Currency;