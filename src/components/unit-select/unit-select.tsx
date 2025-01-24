import * as Ariakit from "@ariakit/react";
import { FormattedMessage, useIntl } from "react-intl";

// This value could be "" while initializing
export type Units = "liter" | "gallon" | "";

type UnitProps = {
  id: string;
  unit: string;
  onChange: (newValue: Units) => void;
  disabled?: boolean;
};

const UnitSelect = ({ id, unit, onChange, disabled }: UnitProps) => {
  const intl = useIntl();
  const displayUnit = {
    "": "",
    liter: intl.formatMessage({ id: "perLiter" }),
    gallon: intl.formatMessage({ id: "perGallon" }),
  };

  const popover = Ariakit.usePopoverStore();
  const placement = Ariakit.useStoreState(popover, "currentPlacement");

  return (
    <Ariakit.SelectProvider
      defaultValue={unit}
      setValue={(newValue: Units) => {
        onChange(newValue);
      }}
      value={unit}
      id={id}
      store={popover}
      placement="bottom-end"
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
        sameWidth
        className={`popover unit-popover placement-${placement}`}
        unmountOnHide={true}
        gutter={-1}
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

export default UnitSelect;
