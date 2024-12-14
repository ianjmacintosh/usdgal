"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { symbols } from "./exchangeRateData"

const Currency = ({
    currency,
    handleCurrencyChange,
    currencies
}: {
    currency: string,
    handleCurrencyChange: (newValue: string) => void,
    disabled: boolean,
    currencies: string[]
}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(currency)
    /*
            <select
                id={`${label.toLowerCase()}_currency`}
                defaultValue={currency}
                onChange={(event) => handleCurrencyChange(event.target.value)}
                aria-label={`Currency`}
                disabled={disabled}
                className="currency"
            >
                {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
            </select>
    */
    return (<Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
                aria-label="Currency"
            >
                {value
                    ? currencies.find((currency: string) => currency === value)
                    : "Select currency..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandInput placeholder="Search for a currency..." />
                <CommandList>
                    <CommandEmpty>No currencies found</CommandEmpty>
                    <CommandGroup>
                        {currencies.map((currency: string) => (
                            <CommandItem
                                key={currency}
                                value={currency}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    handleCurrencyChange(currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === currency ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {`${symbols[currency]} (${currency})`}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
    )
}

export default Currency;