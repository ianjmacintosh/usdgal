import * as Ariakit from "@ariakit/react";
import "./Currency.css"


type SupportedUnits = "liter" | "gallon";
const Unit = (({ id, unit, onUnitChange, disabled }: {
    id: string,
    unit: string,
    onUnitChange: (newValue: SupportedUnits) => void,
    disabled?: boolean
}) => {
    return (
        <>
            <Ariakit.SelectProvider defaultValue={unit} setValue={(newValue: SupportedUnits) => { onUnitChange(newValue) }} id={id}>
                <Ariakit.Select className="button" aria-label="Unit of sale (liters or gallons)" disabled={disabled}>{unit === "liter" ? "per liter" : "per gallon"}</Ariakit.Select>
                <Ariakit.SelectPopover gutter={4} sameWidth className="popover" unmountOnHide={true}>
                    <Ariakit.SelectItem className="select-item" value="gallon">per gallon</Ariakit.SelectItem>
                    <Ariakit.SelectItem className="select-item" value="liter">per liter</Ariakit.SelectItem>
                </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
        </>
    )
});

export default Unit;