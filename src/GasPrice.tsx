function GasPrice({ label, currency, price, onChange, disabled, id }: any) {
  return (
    <label htmlFor={id}>
      {label}
      <input
        type="number"
        value={price}
        onChange={onChange}
        name={id}
        id={id}
        disabled={disabled !== undefined ? true : false}
      />
    </label>
  );
}

export default GasPrice;
