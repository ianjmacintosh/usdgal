import * as Ariakit from "@ariakit/react";
import "./Unit.css";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

type SupportedUnits = "liter" | "gallon";
const Unit = ({
  id,
  unit,
  onUnitChange,
  disabled,
}: {
  id: string;
  unit: string;
  onUnitChange: (newValue: SupportedUnits) => void;
  disabled?: boolean;
}) => {
  const intl = useIntl();
  const displayUnit = {
    "": "",
    liter: intl.formatMessage({ id: "perLiter" }),
    gallon: intl.formatMessage({ id: "perGallon" }),
  };
  useEffect(() => {
    onUnitChange(unit as SupportedUnits);
  }, [unit, onUnitChange]);

  return (
    <Ariakit.SelectProvider
      defaultValue={unit}
      setValue={(newValue: SupportedUnits) => {
        onUnitChange(newValue);
      }}
      value={unit}
      id={id}
    >
      <Ariakit.Select
        className="unit-button button"
        aria-label={intl.formatMessage({ id: "unitOfSale" })}
        disabled={disabled}
      >
        <span className="current-value">
          {displayUnit[unit as keyof typeof displayUnit]}
        </span>
        <Ariakit.SelectArrow className="chevron" />
      </Ariakit.Select>
      <Ariakit.SelectPopover
        gutter={4}
        sameWidth
        className="popover unit-popover"
        unmountOnHide={true}
      >
        <Ariakit.SelectItem className="select-item" value="gallon">
          {unit === "gallon" ? "✓" : ""} <FormattedMessage id="perGallon" />
        </Ariakit.SelectItem>
        <Ariakit.SelectItem className="select-item" value="liter">
          {unit === "liter" ? "✓" : ""} <FormattedMessage id="perLiter" />
        </Ariakit.SelectItem>
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
  );
};

export default Unit;
