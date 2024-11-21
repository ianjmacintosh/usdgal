import "./GasPrice.css";

function GasPrice({ label, price, onChange, disabled, id }: { label: string, price: string, onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean, id: string }) {

  return (
    <label htmlFor={id}>
      {label}
      <input
        type="text"
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
