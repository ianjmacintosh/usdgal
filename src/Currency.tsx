import * as Ariakit from "@ariakit/react";
import { SelectRenderer } from "@ariakit/react-core/select/select-renderer";
import kebabCase from "lodash-es/kebabCase.js";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useState } from "react";
import { symbols, } from "./exchangeRateData"
import "./Currency.css";

const currencyCodes = Object.keys(symbols)
const currencyNames = Object.values(symbols)

function getItem(currencyCode: string) {
    const currencyName = currencyNames[currencyCodes.indexOf(currencyCode)];
    return {
        id: `item-${kebabCase(currencyCode)}`,
        value: currencyCode,
        label: `${currencyName} (${currencyCode})`,
        children: currencyCode,
    };
}

const defaultItems = currencyCodes.map(getItem);

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
            const items = matchSorter(currencyCodes, searchValue);
            setMatches(items.map(getItem));
        });
    }, [searchValue]);

    return (
        <>
            <Ariakit.Select store={select} className="currency-button button">
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

                        {({ value, label, ...item }) => (
                            <Ariakit.ComboboxItem
                                key={item.id}
                                {...item}
                                className="select-item"
                                render={<Ariakit.SelectItem value={value} />}
                            >
                                <span className="select-item-value">{value} {label}</span>
                            </Ariakit.ComboboxItem>
                        )}
                    </SelectRenderer>
                </Ariakit.ComboboxList>
            </Ariakit.SelectPopover>
        </>
    );
}