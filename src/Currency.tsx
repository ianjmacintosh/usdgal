"use client"

import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";
import { startTransition, useMemo, useState } from "react";
import "./Currency.css"

const Currency = ({
    currency,
    handleCurrencyChange,
    // currencies
}: {
    currency: string,
    handleCurrencyChange: (newValue: string) => void,
    // currencies: string[]
}) => {
    const currencies = ["BRL", "USD", "MXN"]

    const [searchValue, setSearchValue] = useState("");

    const matches = useMemo(() => {
        return matchSorter(currencies, searchValue, {
            baseSort: (a, b) => (a.index < b.index ? -1 : 1),
        });
    }, [searchValue, currencies]);

    return (
        <div className="wrapper">
            <Ariakit.ComboboxProvider
                resetValueOnHide
                setValue={(value) => {
                    startTransition(() => {
                        setSearchValue(value);
                    });
                }}
            >
                <Ariakit.SelectProvider defaultValue={currency} setValue={(value) => {
                    handleCurrencyChange(value)
                }}>
                    <Ariakit.Select className="button" aria-label="Currency" />
                    <Ariakit.SelectPopover gutter={4} sameWidth className="popover">
                        <div className="combobox-wrapper">
                            <Ariakit.Combobox
                                autoSelect
                                placeholder="Search..."
                                className="combobox"
                            />
                        </div>
                        <Ariakit.ComboboxList>
                            {matches.map((value) => (
                                <Ariakit.SelectItem
                                    key={value}
                                    value={value}
                                    className="select-item"
                                    render={<Ariakit.ComboboxItem />}
                                />
                            ))}
                        </Ariakit.ComboboxList>
                    </Ariakit.SelectPopover>
                </Ariakit.SelectProvider>
            </Ariakit.ComboboxProvider>
        </div>
    )
}

export default Currency;