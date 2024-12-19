type SupportedUnits = "liter" | "gallon";
const Unit = (({ id, unit, onUnitChange, disabled }: {
    id: string,
    unit: string,
    onUnitChange: (newValue: SupportedUnits) => void,
    disabled?: boolean
}) => {
    return (
        <select
            id={id}
            defaultValue={unit}
            onChange={(e) => { onUnitChange(e.target.value as SupportedUnits) }}
            aria-label={`Unit of sale (liters or gallons)`}
            disabled={disabled}
            className="unit"
        >
            <option value="gallon">per gallon</option>
            <option value="liter">per liter</option>
        </select>
    )
});

export default Unit;