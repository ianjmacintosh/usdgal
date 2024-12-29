const LanguageSelect = ({
  onLanguageChange,
}: {
  onLanguageChange: (newValue: string) => void;
}) => {
  return (
    <select
      onChange={(event) => {
        const newLanguage = event.target.value;
        onLanguageChange(newLanguage);
      }}
      id="language"
    >
      <option value="en-US">English (United States)</option>
      <option value="es-MX">Español (México)</option>
      <option value="pt-BR">Português (Brasil)</option>
      <option value="de-DE">Deutsch (Deutschland)</option>
      <option value="hi-IN">हिन्दी (भारत)</option>
    </select>
  );
};

export default LanguageSelect;
