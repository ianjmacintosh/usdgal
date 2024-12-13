const Currency = ({
    label,
    currency,
    handleCurrencyChange,
    disabled,
    currencies
}) => {
    return (<select
        id={`${label.toLowerCase()}_currency`}
        defaultValue={currency}
        onChange={(event) => handleCurrencyChange(event.target.value)}
        aria-label={`Currency`}
        disabled={disabled}
        className="currency"
    >
        {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
    </select>)
}

export default Currency;