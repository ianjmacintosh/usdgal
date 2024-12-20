import * as Ariakit from "@ariakit/react";
import { SelectRenderer } from "@ariakit/react-core/select/select-renderer";
import type { SelectRendererItem } from "@ariakit/react-core/select/select-renderer";
import deburr from "lodash-es/deburr.js";
import groupBy from "lodash-es/groupBy.js";
import kebabCase from "lodash-es/kebabCase.js";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useState } from "react";
import { symbols, } from "./exchangeRateData"
import "./Currency.css";

const currencies = Object.keys(symbols)

function getItem(country: string) {
    return {
        id: `item-${kebabCase(country)}`,
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

const defaultItems = currencies.map(getItem);

export default function Currency() {
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
        defaultValue: "",
    });

    const selectValue = Ariakit.useStoreState(select, "value");

    useEffect(() => {
        startTransition(() => {
            const items = matchSorter(currencies, searchValue);
            setMatches(items.map(getItem));
        });
    }, [searchValue]);

    return (
        <>
            <Ariakit.SelectLabel store={select}>Country</Ariakit.SelectLabel>
            <Ariakit.Select store={select} className="button">
                <span className="select-value">
                    {selectValue || "Select a country"}
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
                        placeholder="Search..."
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
                                render={<Ariakit.SelectItem value={value} />}
                            >
                                <span className="select-item-value">{value}</span>
                            </Ariakit.ComboboxItem>
                        )}
                    </SelectRenderer>
                </Ariakit.ComboboxList>
            </Ariakit.SelectPopover>
        </>
    );
}