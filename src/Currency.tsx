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
    currencies: string[]
}) => {
    const detailedCurrencies = currencies.map((code) => {
        return {
            value: code as keyof typeof symbols,
            label: `${symbols[code as keyof typeof symbols]} (${code})`
        }
    })
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(currency)
    return (<Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="currency-button rounded-none rounded-tr-lg text-lg h-[60px] justify-end gap-0"
                aria-label="Currency"
            >
                {value
                    ? detailedCurrencies.find((currency) => currency.value === value)?.value
                    : "Select currency..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="end">
            <Command>
                <CommandInput placeholder="Search for a currency..." />
                <CommandList>
                    <CommandEmpty>No currencies found</CommandEmpty>
                    <CommandGroup>
                        {detailedCurrencies.map((currency) => (
                            <CommandItem
                                key={currency.value}
                                value={currency.label}
                                onSelect={(currentValue) => {
                                    const newValue = detailedCurrencies.find((currency) => currency.label === currentValue)?.value || 'USD'
                                    setValue(newValue)
                                    handleCurrencyChange(newValue)
                                    setOpen(false)
                                }}
                            >
                                {currency.label}
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === currency.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
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