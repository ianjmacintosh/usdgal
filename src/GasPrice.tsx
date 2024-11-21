function GasPrice({ label, currency, price, onChange, disabled, id }: any) {
  const formattedPrice = Number(price).toFixed(2);

  return (
    <label htmlFor={id}>
      {label}
      <input
        type="text"
        value={formattedPrice}
        onChange={onChange}
        name={id}
        id={id}
        disabled={disabled !== undefined ? true : false}
      />
    </label>
  );
}

export default GasPrice;
