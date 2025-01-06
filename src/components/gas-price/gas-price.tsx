import "./gas-price.css";

type GasPriceProps = {
  label: string;
  children?: React.ReactNode;
};

function GasPrice({ label, children }: GasPriceProps) {
  return (
    <div className="mt-2 mb-8">
      <fieldset>
        <legend>{label}</legend>
        {children}
      </fieldset>
      {/* {isTinyNumber(number, userLanguage, currency) ? (
        <p className="mt-4">
          <em role="status">
            <FormattedMessage
              id="tinyNumber"
              values={{ displayNumber, currency, number }}
            />
          </em>
        </p>
      ) : (
        ""
      )} */}
    </div>
  );
}

export default GasPrice;
