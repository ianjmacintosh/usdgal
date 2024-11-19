function GasPrice({ label, currency, price, onChange, disabled }: any) {
  return (
    <label htmlFor="localPrice">
      {label}
      <input
        type="number"
        value={price}
        onChange={onChange}
        name="localPrice"
        id="localPrice"
        disabled={disabled !== undefined ? true : false}
      />
    </label>
  );
}

export default GasPrice;
