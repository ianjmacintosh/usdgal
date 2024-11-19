function GasPrice({ label, currency, price, onChange }: any) {
  return (
    <label htmlFor="localPrice">
      {label}
      <input
        type="number"
        value={price}
        onChange={onChange}
        name="localPrice"
        id="localPrice"
      />
    </label>
  );
}

export default GasPrice;
